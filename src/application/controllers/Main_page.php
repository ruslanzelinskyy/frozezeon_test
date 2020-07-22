<?php

/**
 * Created by PhpStorm.
 * User: mr.incognito
 * Date: 10.11.2018
 * Time: 21:36
 */
class Main_page extends MY_Controller
{

    public function __construct()
    {
        parent::__construct();

        App::get_ci()->load->model('User_model');
        App::get_ci()->load->model('Login_model');
        App::get_ci()->load->model('Post_model');

        if (is_prod()) {
            die('In production it will be hard to debug! Run as development environment!');
        }
    }

    public function index()
    {
        $user = User_model::get_user();

        App::get_ci()->load->view('main_page', ['user' => User_model::preparation($user, 'default')]);
    }

    public function get_all_posts()
    {
        $posts = Post_model::preparation(Post_model::get_all(), 'main_page');
        return $this->response_success(['posts' => $posts]);
    }

    public function get_post()
    { // or can be $this->input->post('news_id') , but better for GET REQUEST USE THIS

        $post_id = intval($this->input->get('post_id'));

        if (empty($post_id)) {
            return $this->response_error(CI_Core::RESPONSE_GENERIC_WRONG_PARAMS);
        }

        try {
            $post = new Post_model($post_id);
        } catch (EmeraldModelNoDataException $ex) {
            return $this->response_error(CI_Core::RESPONSE_GENERIC_NO_DATA);
        }

        $posts = Post_model::preparation($post, 'full_info');

        return $this->response(['post' => $posts]);
    }

    public function comment()
    { // or can be App::get_ci()->input->post('news_id') , but better for GET REQUEST USE THIS ( tests )
        $assign_id = $this->input->post('new_comment_assign_id');
        $text = $this->input->post('new_comment_text');
        $parent_id = $this->input->post('new_comment_parent_id');
        $is_parent_updated = $this->input->post('is_parent_updated');

        $user_identified = $this->getIdentifiedUser();

        if (!$user_identified) {
            return $this->response([
                'status' => 'authorization_error',
            ]);
        }

        $user_id = $user_identified['id'];

        $new_comment_data = [
            'user_id' => $user_id,
            'assign_id' => $assign_id,
            'text' => $text,
            'parent_id' => $parent_id,
            'is_parent' => 0,
            'likes' => 0,
        ];

        if($is_parent_updated) {
            $this->Comment_model->make_parent($parent_id);
        }

        $new_comment_model = $this->Comment_model->create($new_comment_data);

        $user = new User_model($user_id);

        $new_comment_data['author_name'] = $user->get_personaname();
        $new_comment_data['id'] = $new_comment_model->get_id();

        return $this->response([
            'last_add_comment_status' => 'success',
            'new_comment' => (object)$new_comment_data
        ]);
    }

    public function authentificate()
    {
        return $this->response(Login_model::authentificate(
            $this->User_model,
            $this->input->post('login'),
            $this->input->post('password')
        ));
    }

    public function authorize()
    {
        return $this->response(Login_model::authorize(
            $this->User_model,
            $this->input->post('token')
        ));
    }

    public function logout()
    {
        return $this->response(['status' => 'logged-out']);
    }

    public function add_money()
    {
        $loadedUserModel = $this->User_model;
        App::get_ci()->load->model('Wallet_model');

        $userIndentified = Login_model::identifyUser(
            $loadedUserModel,
            $this->input->get_request_header('Authorization')
        );

        if (!$userIndentified) {
            return $this->response([
                'status' => 'authorization_error',
            ]);
        }

        return $this->response($this->Wallet_model->refill(
            $loadedUserModel,
            $userIndentified,
            $this->input->post('amount')
        ));
    }

    public function like_comment()
    {
        $comment_id = $this->input->post('comment_id');

        $user_identified = $this->getIdentifiedUser();

        if (!$user_identified) {
            return $this->response([
                'status' => 'authorization_error',
            ]);
        }

        $user_model = new User_model($user_identified['id']);

        if($user_model->can_like()) {
            $comment_model = new Comment_model($comment_id);
            $comment_model->add_like();

            $user_model->like();

            return $this->response([
                'last_like_comment_status' => 'success',
                'comment_likes_result' => $comment_model->get_likes()
            ]);
        } else {
            return $this->response([
                'last_like_comment_status' => 'user_have_no_likes'
            ]);
        }
    }

    public function like_post() {
        $post_id = $this->input->post('post_id');

        $user_identified = $this->getIdentifiedUser();

        if (!$user_identified) {
            return $this->response([
                'status' => 'authorization_error',
            ]);
        }

        $user_model = new User_model($user_identified['id']);

        if($user_model->can_like()) {
            $post_model = new Post_model($post_id);
            $post_model->add_like();

            $user_model->like();

            return $this->response([
                'last_like_post_status' => 'success',
                'post_likes_result' => $post_model->get_likes()
            ]);
        } else {
            return $this->response([
                'last_like_comment_status' => 'user_have_no_likes'
            ]);
        }
    }

    public function buy_boosterpack()
    {
        $loadedUserModel = $this->User_model;
        $user_identified = $this->getIdentifiedUser();

        if (!$user_identified) {
            return $this->response([
                'status' => 'authorization_error',
            ]);
        }

        App::get_ci()->load->model('Boosterpack_model');

        $boosterpack = $this->Boosterpack_model
            ->find_by_id($this->input->post('boosterpack_id'));

        if (empty($boosterpack)) {
            return $this->response([
                'status' => 'boosterpack_does_not_exists',
            ]);
        }

        App::get_ci()->load->model('Buy_pack_service');

        return $this->response($this->Buy_pack_service->buy_pack(
            $loadedUserModel,
            $user_identified,
            $boosterpack
        ));
    }

    private function getIdentifiedUser()
    {
        $loadedUserModel = $this->User_model;

        $user_identified = Login_model::identifyUser(
            $loadedUserModel,
            $this->input->get_request_header('Authorization')
        );

        return $user_identified;
    }
}
