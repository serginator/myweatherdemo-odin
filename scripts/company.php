<?php
    require "aps/2/runtime.php";

    /**
     * @type("http://myweatherdemo.srs30.com/company/1.4")
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
         * @link("http://myweatherdemo.srs30.com/city/1.3[]")
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

        /**
         * @type(string)
         * @title("Notification ID")
         */
        public $notificationId;

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

            // preparing a subscription to Changed events type, designating handler as onLocationChange()
            $sub = new \APS\EventSubscription(\APS\EventSubscription::Changed, "onLocationChange");
            // we want to track linked core/account resource
            $sub->source->id=$this->account->aps->id;
            // getting access to controller conntector and subscribing
            $apsc = \APS\Request::getController();
            $apsc->subscribe($this, $sub);
        }

        public function unprovision() {
            $url = $this->application->url . "company/" . $this->company_id;
            $this->send_curl_request('DELETE', $url);
        }

        public function configure($new) {
            $url = $this->application->url . "company/" . $this->company_id;
            $request = array(
                'username' => $new->username,
                'password' => $new->password
            );
            $this->send_curl_request('PUT', $url, $request);

            // Get instance of the Notification Manager:
            $notificationManager = \APS\NotificationManager::getInstance();
            // Create Notification structure
            $notification = new \APS\Notification;
            $notification->message = new \APS\NotificationMessage("Company update");
            $notification->details = new \APS\NotificationMessage("Company details were updated");
            $notification->status = \APS\Notification::ACTIVITY_READY;
            $notification->packageId = $this->aps->package->id;

            $notificationResponse = $notificationManager->sendNotification($notification);
            // Store the Notification ID to update or remove it in other operations
            $this->notificationId = $notificationResponse->id;
        }

        public function retrieve() {
            $url = $this->application->url . "company/" . $this->company_id;
            $response = $this->send_curl_request('GET', $url);
            $this->query_counter->usage = $response->{'weatherCount'};
        }

        /**
         * @verb(GET)
         * @path("/getTemperature")
         */
        public function getTemperature(){
            //get temperature from the external server
            $url = $this->application->url . "company/" . $this->company_id;
            $response = $this->send_curl_request('GET', $url);

            $temperature = array(
                'city' => $response->{'city'},
                'country' => $response->{'country'},
                'celsius' => $response->{'celsius'},
                'fahrenheit' => $response->{'fahrenheit'}
            );
            return $temperature;
        }

        /**
         * @verb(POST)
         * @path("/onLocationChange")
         * @param("http://aps-standard.org/types/core/resource/1.0#Notification",body)
         */
        public function onLocationChange($event) {
            $url = $this->application->url . "company/" . $this->company_id;
            // getting updated core/account resource
            $apsc = \APS\Request::getController();
            $account = $apsc->getResource($event->source->id);
            $resp = $this->send_curl_request('GET', $url);
            if ($resp->city != $account->addressPostal->locality ||
                    $resp->country != $account->addressPostal->countryName) {
                $request = array(
                    'city' => $account->addressPostal->locality,
                    'country' => $account->addressPostal->countryName
                );
                $this->send_curl_request('PUT', $url, $request);
            }
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
