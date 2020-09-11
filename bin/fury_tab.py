from ipywidgets import Output
from IPython.display import display, HTML

class FuryTab(object):

    def __init__(self):
        # self.tab = Output(layout={'height': '600px'})
        self.tab = Output(layout={'height': 'auto'})
        self.tab.append_display_data(HTML(filename='doc/fury_client.html'))
        
