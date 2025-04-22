# Emergecny calling on WebRTC API

# Problem description.

WebRTC CAMARA service aims to provide consumers with the ability to use their phone number (MSISDN) for outgoing and incoming calls from non-SIM card or non-cellular devices. Any web-based application can integrate this WebRTC CAMARA service as a feature utilizing well-known HTTP and WebRTC technologies.To access the service, users are required to authenticate using their digital credentials associated with their Internet Service Provider account, for example their operator app credentials. Registration from a web endpoint is necessary to enable the service on these devices.

The regulator entities in many countries requires that for any voice call service, the emergency call service must be available, which implies knowing the location of the user who is making a call.

Knowing the service provided and the regulation of emergency calls. The problem is as follows. A user links his device (Tablet, XR glasses...) with his phone number thanks to the WebRTC CAMARA service. the user may leave their phone (containing the SIM) at home and goes away with the WebRTC CAMARA device (e.g. tablet. No SIM). If this user makes an emergency call, there migh be issues to know their location.

It is necessary to find a solution to locate the above-mentioned devices. This document aims to solve Issue#25 of the WebRTC CAMARA Group

## Scenarios.

Introduction:

Regarding the following scenarios. The identification of the user's location cannot be done through the MSISDN parameter. This parameter is unknown in any of the scenarios.

It is therefore proposed to identify the user's location by IP address. The IP address is a private parameter and it is necessary to obtain a public IP through NAT algorithms (CGNAT converts private IP to public IP following an algorithm).

The deterministic NAT algorithm is the one that best fits our needs. From a developer's public IP, the customer's private IP can be located on the BNG or FTTH.

### 1.User calls from WebRTC device connected to cellular network

In the 5G standard architectures the Access and Mobility Management function (AMF) is the element in charge of managing the UE mobility within the different gNodeBs of the operator. This information of the radio cell a user is connected to, is sent to the UDM throughout the N8 interface as outlined in the 3GPP standard. However, this information is also needed by the SMF to determine the best UPF the user can connect to, this is done through the N11 interface.

In this case, the user is using WebRTC CAMARA from his cell phone connected to the cellular network. The device has its own SIM. It is possible to locate the cell to which the user is connected.

#### 1.1 Multisim

If the user is making a call from a mobile phone with multisim capability, the antenna location described above may not work.
Multisim enabled devices have a primary SIM and a secondary SIM with a different phone number. The user only appreciates that there is one SIM (with a single phone number).

The localization in multisim scenario should be checked.

### 2. User calls from the WebRTC CAMARA device connected to his home wifi

The user makes a call from a device using BYN. The user is connected to the Wifi network at home.  The operator can usually determine the connection originated from the home connection point.
The subscriber's address is known.

### 3. User calls from WebRTC CAMARA device connected to a different wifi than home wifi (eg. starbucks)

In this scenario the user is using the WebRTC CAMARA service on a device that does not have a SIM (cannot be located). The user's devices is also connected to a Wifi network other than his home network (Eg: Wifi network of a coffee shop).

This case is the most difficult to solve

Since the user's device could be mobile, to differentiate between scenarios 2 and 3, we need the user to confirm whether they are at their registered emergency address. If they are, PSAP routing will be based on that address. If they are not, the emergency call will be routed to the national emergency center. Note: The logic for confirming the registered address could potentially be used when the user is on a cellular network and the WebRTC CAMARA App/Service does not have access to the device's location using the cellular network.

### 4. User calls from WebRTC CAMARA device (Mobile phone) that can provide device location (and user has provided permission to fetch location) 

In this scenario, the user is utilizing the WebRTC CAMARA service on a device (mobile phone) that allows the WebRTC CAMARA app to access the device's location. If the user has granted location access permission, the emergency call will be placed with the device's location, and PSAP routing will be based on both the device location and the registered emergency address. If the device does not support location access or if the user has not granted permission, it will revert to scenario 2 or 3.


--

Hi deepack, 

Since we deprecate the term "BYON service", I suggest to change all references to "WebRTC CAMARA service".

Despite of that, the document and the proposal is still valid. But I will include and extra parameter in order to define the call as an "emergency", and emphasize the source of the location.

Let me elaborate it.

--

Feedback about the problem:

- Clear preference for Scenario 4. But the location permission is, indeed, a problem, since it is not granted at all. On these cases, the location should be done via IP. 
- If IP is neither a source of truth, there is another interesting approach that is to use the access_token information to identify the CAMARA API subscriber and use that information. I think that it is equivalent to use the MSISDN phone number. :thinking:
- It seems to have an extra problem here: roaming. Based on TS 103 479 if the user is moving, the session must be updated with the current location. That makes an extra effort.
- Another interesting source of knowledge is the WebRTC stack itself, the ICE protocol can retrieve all device IPs, then we can use them for location on the netowrk side.
- Reviewing RFC 5985 about HELD (HTTP-Enabled Location Delivery) there are more scenarios to review, like VPNs. But this RFC should be a clear inspiration of how to communicate between a location service and a user endpoint.

My suggestion here:

- Rely on our colleagues from the DeviceLocation CAMARA group (https://github.com/camaraproject/DeviceLocation/blob/main/code/API_definitions/location-retrieval.yaml). They are focusiing on the device location. It is a complex problem, there are a lot of things to consider, so it could be great if we can re-use their work. They are doing an amazing jog to control autonomous fying drone, probably they can help.
- What we can do, is to accept on our session establiment process the output of the DeviceLocationRetrieval and cleary identify the call as an emergency. This will have two benefits:
  - Re-using all what is already offered by the operator on DeviceLocation APIs (now and future developments)
  - Cleary identifying the call as an emergency, will instruct the network (GW) to use any possible method to locate the device (inspect SDP and attach geolcation), and also grant access to netowrk without registration.
- Personal suggestion: Two extra parameters fo call-handling POST operation

Hope this helps!

 