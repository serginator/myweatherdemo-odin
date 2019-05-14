<?php
    require "aps/2/runtime.php";
    /**
     * @type("http://myweatherdemo.srs30.com/user/1.1")
     * @implements("http://aps-standard.org/types/core/resource/1.0")
     */
    class user extends \APS\ResourceBase
    {
        /**
         * @link("http://myweatherdemo.srs30.com/company/1.4")
         * @required
         */
        public $company;
        /**
         * @link("http://aps-standard.org/types/core/service-user/1.0")
         * @required
         */
        public $service_user;

        /**
         * @type(string)
         * @title("User ID")
         */
        public $user_id;

        /**
         * @type(string)
         * @title("City")
         */
        public $city;

        /**
         * @type(string)
         * @title("Country")
         */
        public $country;

        /**
         * @type(string)
         * @title("Username")
         */
        public $username;

        /**
         * @type(string)
         * @title("Password")
         */
        public $password;

        /**
         * @type(string)
         * @title("Units")
         */
        public $units;

        /**
         * @type(boolean)
         * @title("Include Humidity")
         */
        public $include_humidity;

        public function provision() {
            $url = $this->company->application->url . "user/";
            $request = array(
                'username' => $this->username,
                'password' => $this->password,
                'country' => $this->country,
                'companyid' => $this->company->company_id,
                'city' => $this->city,
                'units' => $this->units,
                'includeHumidity' => $this->include_humidity
            );
            $response = $this->send_curl_request('POST', $url, $request);
            $this->user_id = $response->{'id'};
        }

        public function unprovision() {
            $url = $this->company->application->url . "user/" . $this->user_id;
            $this->send_curl_request('DELETE', $url);
        }

        public function configure($new) {
            $url = $this->company->application->url . "user/" . $this->user_id;

            $request = array(
                'username' => $new->username,
                'password' => $new->password,
                'country' => $new->country,
                'companyid' => $this->company->company_id,
                'city' => $new->city,
                'units' => $new->units,
                'includeHumidity' => $new->include_humidity
            );
            $this->send_curl_request('PUT', $url, $request);
        }
    }
?>
