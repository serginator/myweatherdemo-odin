<?php
    require "aps/2/runtime.php";

    /**
     * @type("http://myweatherdemo.srs30.com/city/1.1")
     * @implements("http://aps-standard.org/types/core/resource/1.0")
     */
    class city extends \APS\ResourceBase
    {
        /**
         * @link("http://myweatherdemo.srs30.com/company/1.4")
         * @required
         */
        public $company;

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
         * @type(boolean)
         * @title("Show humidity")
         */
        public $include_humidity;

        /**
         * @type(string)
         * @title("Units")
         */
        public $units;

        /**
         * @type(string)
         * @title("External city")
         */
        public $external_city_id;

        public function provision() {
            $url = $this->company->application->url . "watchcity/";
            $request = array(
                'country' => $this->country,
                'companyid' => $this->company->company_id,
                'city' => $this->city,
                'units' => $this->units,
                'includeHumidity' => $this->include_humidity
            );
            $response = $this->send_curl_request('POST', $url, $request);
            $this->external_city_id = $response->{'id'}
        }

        public function unprovision() {
            $url = $this->company->application->url . "watchcity/" . $this->external_city_id;
            $this->send_curl_request('DELETE', $url);
        }

        public function configure($new) {
            $url = $this->company->application->url . "watchcity/" . $this->external_city_id;
            $request = array(
                'country' => $new->country,
                'companyid' => $this->company->company_id,
                'city' => $new->city,
                'units' => $new->units,
                'includeHumidity' => $new->include_humidity
            );
            $this->send_curl_request('PUT', $url, $request);
        }

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
