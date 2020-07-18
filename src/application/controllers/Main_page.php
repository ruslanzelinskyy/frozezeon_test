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

        if (is_prod())
        {
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
        $posts =  Post_model::preparation(Post_model::get_all(), 'main_page');
        return $this->response_success(['posts' => $posts]);
    }

    public function get_post($post_id){ // or can be $this->input->post('news_id') , but better for GET REQUEST USE THIS

        $post_id = intval($post_id);

        if (empty($post_id)){
            return $this->response_error(CI_Core::RESPONSE_GENERIC_WRONG_PARAMS);
        }

        try
        {
            $post = new Post_model($post_id);
        } catch (EmeraldModelNoDataException $ex){
            return $this->response_error(CI_Core::RESPONSE_GENERIC_NO_DATA);
        }


        $posts =  Post_model::preparation($post, 'full_info');
        return $this->response_success(['post' => $posts]);
    }

    public function comment($post_id,$message){ // or can be App::get_ci()->input->post('news_id') , but better for GET REQUEST USE THIS ( tests )

        if (!User_model::is_logged()){
            return $this->response_error(CI_Core::RESPONSE_GENERIC_NEED_AUTH);
        }

        $post_id = intval($post_id);

        if (empty($post_id) || empty($message)){
            return $this->response_error(CI_Core::RESPONSE_GENERIC_WRONG_PARAMS);
        }

        try
        {
            $post = new Post_model($post_id);
        } catch (EmeraldModelNoDataException $ex){
            return $this->response_error(CI_Core::RESPONSE_GENERIC_NO_DATA);
        }


        $posts =  Post_model::preparation($post, 'full_info');
        return $this->response_success(['post' => $posts]);
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

    public function add_money(){

        $loadedUserModel = $this->User_model;
        App::get_ci()->load->model('Wallet_model');

        $userIndentified = Login_model::identifyUser(
            $loadedUserModel,
            $this->input->get_request_header('Authorization')
        );

        if(!$userIndentified) {
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

    public function buy_boosterpack(){
        $loadedUserModel = $this->User_model;
        $userIdentified = $this->getIdentifiedUser();

        if(!$userIdentified) {
            return $this->response([
                'status' => 'authorization_error',
            ]);
        }

        App::get_ci()->load->model('Boosterpack_model');

        $boosterpack = $this->Boosterpack_model
            ->find_by_id($this->input->post('boosterpack_id'));

        if(empty($boosterpack)) {
            return $this->response([
                'status' => 'boosterpack_does_not_exists',
            ]);
        }

        App::get_ci()->load->model('Buy_pack_service');

        return $this->response($this->Buy_pack_service->buy_pack(
            $loadedUserModel,
            $userIdentified,
            $boosterpack
        ));
    }

    public function like(){
        // todo: add like post\comment logic
        return $this->response_success(['likes' => rand(1,55)]); // Колво лайков под постом \ комментарием чтобы обновить
    }

    private function getIdentifiedUser() {
        $loadedUserModel = $this->User_model;

        $userIdentified = Login_model::identifyUser(
            $loadedUserModel,
            $this->input->get_request_header('Authorization')
        );

        return $userIdentified;
    }
}
