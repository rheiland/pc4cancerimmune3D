import "./styles.css";

import vtkWSLinkClient from 'vtk.js/Sources/IO/Core/WSLinkClient';
import vtkRemoteView from 'vtk.js/Sources/Rendering/Misc/RemoteView';
import { connectImageStream } from 'vtk.js/Sources/Rendering/Misc/RemoteView';

import SmartConnect from 'wslink/src/SmartConnect';

vtkWSLinkClient.setSmartConnectClass(SmartConnect);

document.body.style.padding = '0';
document.body.style.margin = '0';

const divRenderer = document.createElement('div');
document.body.appendChild(divRenderer);

divRenderer.style.position = 'relative';
divRenderer.style.width = '100vw';
divRenderer.style.height = '100vh';
divRenderer.style.overflow = 'hidden';

// loading
const divLoading = document.createElement('div');
const txtLoading = document.createElement('h2');
txtLoading.innerHTML = "Loading...";
divLoading.classList.add("loader");
txtLoading.classList.add("loadertxt");
divRenderer.appendChild(divLoading);
divRenderer.appendChild(txtLoading);
divRenderer.classList.add("parent");

const view = vtkRemoteView.newInstance({
  rpcWheelEvent: 'viewport.mouse.zoom.wheel',
});
view.setContainer(divRenderer);
view.setInteractiveRatio(1);
view.setInteractiveQuality(50); // jpeg quality

window.addEventListener('resize', view.resize);

const clientToConnect = vtkWSLinkClient.newInstance();

// Error
clientToConnect.onConnectionError((httpReq) => {
  const message =
    (httpReq && httpReq.response && httpReq.response.error) ||
    `Connection error`;
  console.error(message);
  console.log(httpReq);
  txtLoading.innerHTML = message;
});

// Close
clientToConnect.onConnectionClose((httpReq) => {
  const message =
    (httpReq && httpReq.response && httpReq.response.error) ||
    `Connection close`;
  console.error(message);
  console.log(httpReq);
  txtLoading.innerHTML = message;
});

// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
      element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, eventHandler);
  }
};

// hint: if you use the launcher.py and ws-proxy just leave out sessionURL
// (it will be provided by the launcher)
const config = {
    // sessionManagerURL: 'http://127.0.0.1:8081/paraview',
    // sessionManagerURL: 'https://fury.grg.sice.indiana.edu/paraview',
    sessionManagerURL: 'https://fury-server.hubzero.org/paraview',
    application: 'tumor'
};


// Connect
clientToConnect
  .connect(config)
  .then((validClient) => {
    connectImageStream(validClient.getConnection().getSession());

    const session = validClient.getConnection().getSession();
    view.setSession(session);
    view.setViewId(-1);
    view.render();

    session.call('tumor.update_view', [['my_custom_url', 'and a folder'], ]);
    session.call('tumor.add_frame', ['{"centers":(0,1,1)}']);

    // Listen to messages from parent window
    bindEvent(window, 'message', function (e) {
      session.call('tumor.update_view', [['my_custom_url', 'and a folder'], ]);
      session.call('tumor.add_frame', ['{"centers":(0,1,1)}']);
      session.call('tumor.add_frame', [e.data]);
      console.log(e.data);
    });
    divRenderer.removeChild(divLoading);
    divRenderer.removeChild(txtLoading);
    divRenderer.classList.remove("parent");
  })
  .catch((error) => {
    console.error(error);
    txtLoading.innerHTML = message;
    divRenderer.appendChild(divLoading);
    divRenderer.appendChild(txtLoading);
    divRenderer.classList.add("parent");
  });
