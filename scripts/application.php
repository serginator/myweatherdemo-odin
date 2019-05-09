<?php
    require "aps/2/runtime.php";

    /**
     * @type("http://myweatherdemo.srs30.com/application/1.0")
     * @implements("http://aps-standard.org/types/core/application/1.0")
     */
    class app extends \APS\ResourceBase
    {
        /**
         * @link("http://myweatherdemo.srs30.com/company/1.2[]")
         */
        public $companies;

        /**
         * @type(string)
         * @title("URL")
         */
        public $url;

        /**
         * @type(string)
         * @title("Token")
         * @encrypted
         */
        public $token;
    }
?>
