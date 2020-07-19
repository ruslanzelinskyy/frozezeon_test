<?php

class Buy_pack_service extends CI_Model
{

    private function generate_likes(Array $boosterpack): Int
    {
        return rand(1, $boosterpack['bank'] + $boosterpack['price']);
    }

    public function buy_pack(
        User_model $loadedUserModel,
        Array $user_identified,
        Array $boosterpack
    ): Array
    {
        if ($user_identified['wallet_balance'] < $boosterpack['price']) {
            return [
                'last_buy_status' => 'not_enough_money'
            ];
        }

        $likes_generated = $this->generate_likes($boosterpack);
        $result_likes = $user_identified['wallet_likes'] + $likes_generated;

        $this->Boosterpack_model->buy_pack($boosterpack, $likes_generated);

        App::get_ci()->load->model('User_boosterpack_history_model');

        $this->User_boosterpack_history_model->create([
            'boosterpack_id' => $boosterpack['id'],
            'user_id' => $user_identified['id'],
            'likes' => $likes_generated,
        ]);

        App::get_ci()->load->model('Wallet_model');

        $result_balance = $user_identified['wallet_balance'] - $boosterpack['price'];

        $this->Wallet_model->buy_pack($loadedUserModel, $user_identified, $result_balance, $result_likes);

        return [
            'last_buy_status' => 'success',
            'userMoney' => $result_balance,
            'userLikesCount' => $result_likes,
            'last_buy_likes_count' => $likes_generated,
        ];
    }
}
