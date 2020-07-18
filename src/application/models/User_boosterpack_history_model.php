<?php

class User_boosterpack_history_model extends CI_Emerald_Model {
    const CLASS_TABLE = 'user_boosterpack_history';

    public function create(Array $data) {
        $data['date_created'] = date('Y-m-h H:i:s');

        App::get_ci()->s
            ->from(self::CLASS_TABLE)
            ->insert($data)
            ->execute();
    }
}
