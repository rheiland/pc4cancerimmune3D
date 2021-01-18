from ipywidgets import Output
from IPython.display import HTML, Javascript, display
import json


class FuryTab(object):

    def __init__(self):
        self.tab = Output(layout={'height': '650px'})
        #self.tab = Output(layout={'height': 'auto'})
        #self.tab.append_display_data(HTML(filename='doc/fury_client.html'))
        #self.tab.append_display_data(Javascript(
        #    filename='doc/FuryWebClient.js'))
        html = \
            """
            <iframe
                src='http://fury.grg.sice.indiana.edu/tumor/'
                height='650' width='50%'>
            </iframe>
            """
        html = \
            """
            <iframe src='doc/fury_client.html' height='650' width='50%'>
            </iframe>
            """
        html = \
            """
            <iframe src='doc/fury_client.html' height='650' width='50%'
                align="left", id="fury_frame">
            </iframe>
            <iframe src='https://fury-server.hubzero.org/tumor/'
                height='650' width='50%' align="right">
            </iframe>
            """
        self.tab.append_display_data(HTML(html))
        js = \
            """
            element.css({backgroundColor: "gray", margin: "0px",
                         padding: "0px"});
            element.height(100);
            element.width(100);
            element.html( $( "<div id='fury'></div>" ) );

            const newScriptTag = document.createElement('script');
            newScriptTag.type = 'text/javascript';
            newScriptTag.src = 'doc/FuryWebClient.js';
            document.body.appendChild(newScriptTag);
            """
        # self.tab.append_display_data(Javascript(js))
        # self.tab.append_display_data(Javascript(filename='doc/FuryWebClient.js'))

    def reset(self):
        """Send Event to clear the visualization."""
        data = {'function': 'reset_view',
                'folder': '',
                'filename': ''}
        self.__send(data)

    def send_data(self, folder, filename):
        """Send Folder and filename to server."""
        data = {'function': 'update_view',
                'folder': folder,
                'filename': filename}
        self.__send(data)

    def __send(self, data):
        """Send information to Server via IFrame."""
        s_data = json.dumps(data)
        js_call = \
            """
            var my_iframe = document.getElementById('fury_frame');
            my_iframe.contentWindow.postMessage('{0}','*');
            """.format(s_data)
        print(js_call)
        display(Javascript(js_call))

