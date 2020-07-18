<?php

class Logger extends CI_Log
{
    private $custom_levels = [
        'WALLET' => 5
    ];

    public function __construct()
    {
        parent::__construct();

        $this->ci =& get_instance();
    }

    public function log_wallet_refill(
        $user_id,
        $balance_before,
        $total_before,
        $balance_result,
        $total_result
    ): void
    {
        $this->default_log('wallet',
            "USERID: {$user_id}; " .
            "BALANCE_BEFORE: {$balance_before}; " .
            "TOTAL_BEFORE: {$total_before}; " .
            "BALANCE_RESULT: {$balance_result}; " .
            "TOTAL_RESULT: {$total_result}."
            , 'wallet');
    }

    private function default_log($level, $msg, $subdir)
    {
        if ($this->_enabled === FALSE) {
            return FALSE;
        }

        $level = strtoupper($level);

        $notInDefaultLevels = !isset($this->_levels[$level]) || ($this->_levels[$level] > $this->_threshold);
        $notInCustomLevels = empty($this->custom_levels[$level]);
        if ($notInDefaultLevels && $notInCustomLevels) {
            return FALSE;
        }

        $dir = $this->_log_path . $subdir;

        is_dir($dir) ? false : mkdir($dir);

        $filepath = $dir . DIRECTORY_SEPARATOR . 'log-' . date('Y-m-d') . '.php';
        $message = '';

        if (!file_exists($filepath)) {
            $message .= "<" . "?php  if ( ! defined('BASEPATH'))
        exit('No direct script access allowed'); ?" . ">\n\n";
        }

        if (!$fp = @fopen($filepath, 'ab')) {
            return FALSE;
        }

        $message .= $level . ' ' . (($level == 'INFO') ? ' -' : '-') . ' ';
        $message .= date($this->_date_fmt) . ' --> ' . $msg . "\n";

        flock($fp, LOCK_EX);
        fwrite($fp, $message);
        flock($fp, LOCK_UN);
        fclose($fp);

        @chmod($filepath, FILE_WRITE_MODE);
        return TRUE;
    }
}
