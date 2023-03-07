import { TypedObject } from "./TypedObject";
/**
 * This is a base class that wraps a Webservice/RemoteObject object. Since the concrete classes are
 * singletons, we always have a single instance of the webservice wsdl downloaded for efficiency.
 * @author Flexicious
 * @constructor
 * @namespace com.flexicious.example.serviceproxies
 *
 */
export default class ServiceProxyBase extends TypedObject {
  constructor(ro) {
    super();
    this.remoteObject = ro;
  }

  getClassNames() {
    return ["ServiceProxyBase", "TypedObject"];
  }

  /*protected var webSerivce:WebService;

     public function ServiceProxyBase(webSerivce:mx.rpc.soap.WebService)
     {
     this.webSerivce=webSerivce;
     }*/
  callServiceMethod(token, resultFunction, faultFunction) {
    if (typeof faultFunction === "undefined") faultFunction = null;

    if (faultFunction === null) faultFunction = this.defaultFaultHandler;

    const evt = {};
    evt.result = token;
    window.setTimeout(() => {
      resultFunction(evt);
    }, this.delay);
  }

  defaultFaultHandler(error, token) {
    if (typeof token === "undefined") token = null;
    window.alert(`Error occured while calling service method${error}`);
  }
}
