<?php
    require "aps/2/runtime.php";
    /**
     * @type("http://myweatherdemo.srs30.com/user/1.0")
     * @implements("http://aps-standard.org/types/core/resource/1.0")
     */
    class user extends \APS\ResourceBase
    {
        /**
         * @link("http://myweatherdemo.srs30.com/company/1.2")
         * @required
         */
        public $company;
        /**
         * @link("http://aps-standard.org/types/core/service-user/1.0")
         * @required
         */
        public $service_user;
    }
?>
