import sys

import warnings; warnings.simplefilter("ignore")
from path import path

PROJECT_ROOT = path(__file__).abspath().dirname().dirname()
SITE_ROOT = PROJECT_ROOT.dirname()
MEDIA_ROOT = PROJECT_ROOT / 'media'

sys.path.append(SITE_ROOT)
sys.path.append(PROJECT_ROOT / 'apps')
sys.path.append(PROJECT_ROOT / 'libs')
