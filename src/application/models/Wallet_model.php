<?php

class Wallet_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function refill(User_model $loadedUserModel, Array $user_identified, Int $amount): Array
    {
        $current_balance = $user_identified['wallet_balance'];
        $current_total_refilled = $user_identified['wallet_total_refilled'];

        $result_balance = $current_balance + $amount;
        $result_total_refilled = $current_total_refilled + $amount;

        App::get_ci()->s->start_trans();

        App::get_ci()->s
            ->from($loadedUserModel::CLASS_TABLE)
            ->where(['id' => $user_identified['id']])
            ->update(['wallet_balance' => $result_balance])
            ->execute();

        App::get_ci()->s
            ->from($loadedUserModel::CLASS_TABLE)
            ->where(['id' => $user_identified['id']])
            ->update(['wallet_total_refilled' => $result_total_refilled])
            ->execute();

        App::get_ci()->s->commit();

        App::get_ci()->load->library('Logger');

        $this->logger->log_wallet_refill(
            $user_identified['id'],
            $current_balance,
            $current_total_refilled,
            $result_balance,
            $result_total_refilled
        );

        return [
            'last_refill_status' => 'success',
            'result_balance' => $result_balance
        ];
    }
}
