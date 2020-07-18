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

    public static function identifyUser(User_model $loadedUserModel, String $token) {
        $user = $loadedUserModel->find_by_token($token);

        if(empty($user)) {
            return false;
        }

        return $user;
    }

    public static function authorize(
        User_model $loadedUserModel,
        String $token
    ): Array
    {

        $userIndentified = self::identifyUser($loadedUserModel, $token);

        if(!$userIndentified) {
            return [
                'status' => 'authorization_error',
            ];
        }

        return [
            'token' => $token,
            'status' => 'success',
            'username' => $userIndentified['personaname'],
            'money' => $userIndentified['wallet_balance'],
            'likes' => $userIndentified['wallet_likes']
        ];
    }
}
