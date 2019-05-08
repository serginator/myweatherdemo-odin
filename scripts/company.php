<?php
    require "aps/2/runtime.php";

    /**
     * @type("http://myweatherdemo.srs30.com/company/1.0")
     * @implements("http://aps-standard.org/types/core/resource/1.0")
     */
    class company extends \APS\ResourceBase
    {

        /**
         * @link("http://myweatherdemo.srs30.com/application/1.0")
         * @required
         */
        public $application;

        /**
         * @link("http://myweatherdemo.srs30.com/user/1.0[]")
         */
        public $users;

        /**
         * @link("http://myweatherdemo.srs30.com/city/1.0[]")
         */
        public $cities;

        /**
         * @link("http://aps-standard.org/types/core/account/1.0")
         * @required
        */
        public $account;

        /**
         * @type("http://aps-standard.org/types/core/resource/1.0#Counter")
         * @unit("unit")
         * @title("Number of queries in MyWeatherDemo srs30 UI")
         */
        public $query_counter;

        /**
         * @type(string)
         * @title("Company identifier in MyWeatherDemo")
         */
        public $company_id;

        /**
         * @type(string)
         * @title("Login to MyWeatherDemo interface")
         */
        public $username;

        /**
         * @type(string)
         * @title("Password for MyWeatherDemo user")
         */
        public $password;

        public function provision() {
            $request = array(
                'country' => $this->account->addressPostal->countryName,
                'city' => $this->account->addressPostal->locality,
                'name' => $this->account->companyName
            );

            $url = $this->application->url . "company/";

            $response = $this->send_curl_request('POST', $url, $request);

            // need to save company_id in APSC, going to use that later to delete a resource in unprovision()
            // username and password will be used to login to MyWeatherDemo web interface
            $this->company_id = $response->{'id'};
            $this->username = $response->{'username'};
            $this->password = $response->{'password'};
        }

        public function unprovision() {
            $url = $this->application->url . "company/" . $this->company_id;
            $this->send_curl_request('DELETE', $url);
        }

        // you can add your own methods as well, don't forget to make them private
        private function send_curl_request($verb, $url, $payload = ''){
            $token = $this->application->token;
            $headers = array(
                'Content-type: application/json',
                'x-provider-token: '. $token
            );
            $ch = curl_init();

            curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_CUSTOMREQUEST => $verb,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => json_encode($payload)
            ));

            $response = json_decode(curl_exec($ch));

            curl_close($ch);
            return $response;
        }
    }
?>
