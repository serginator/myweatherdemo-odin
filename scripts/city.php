<?php
    require "aps/2/runtime.php";

    /**
     * @type("http://myweatherdemo.srs30.com/city/1.0")
     * @implements("http://aps-standard.org/types/core/resource/1.0")
     */
    class city extends \APS\ResourceBase
    {
        /**
         * @link("http://myweatherdemo.srs30.com/company/1.2")
         * @required
         */
        public $company;
    }
?>
