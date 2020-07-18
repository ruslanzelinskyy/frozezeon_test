<?php
class Login_model extends CI_Model {

    public function __construct()
    {
        parent::__construct();

    }

    public static function authentificate(
        User_model $loadedUserModel,
        String $userEmail,
        String $userPassword
    ): Array
    {
        $user = $loadedUserModel->find_by_email($userEmail);

        if(empty($user) || $user['password'] != $userPassword) {

            return ['status' => 'authentification_error'];
        }

        $bytes = random_bytes(5);
        $token = bin2hex($bytes);

        App::get_ci()->s
            ->from($loadedUserModel::CLASS_TABLE)
            ->where(['id'=> $user['id']])
            ->update(['token' => $token])
            ->execute();

        return self::authorize($loadedUserModel, $token);
    }

    public static function authorize(
        User_model $loadedUserModel,
        String $token
    ): Array
    {
        $user = $loadedUserModel->find_by_token($token);

        if(empty($user)) {
            return [
                'token' => '',
                'status' => 'authorization_error',
                'username' => ''
            ];
        }

        return [
            'token' => $token,
            'status' => 'success',
            'username' => $user['personaname']
        ];
    }
}
