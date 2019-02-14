
import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler,LoggingEventHandler

class FileChangeHandler(PatternMatchingEventHandler):
  def on_modified(self, event): self.process(event);
  def on_created(self, event): self.process(event);
  def process(self, event):
      """
      event.event_type
          'modified' | 'created' | 'moved' | 'deleted'
      event.is_directory
          True | False
      event.src_path
          path/to/observed/file
      """
      # the file will be processed there
      print (event.src_path, event.event_type)  # print now only for degug

def watch_path(path='.', patterns=None, ignore_patterns=None, ignore_directories=False, case_sensitive=False):
  logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
  # https://pythonhosted.org/watchdog/api.html#watchdog.events.FileSystemEventHandler for events
  # event_handler PatternMatchingEventHandler(patterns=None, ignore_patterns=None, ignore_directories=False, case_sensitive=False)
  # subclass RegexMatchingEventHandler
  observer = Observer()
  observer.schedule(FileChangeHandler(), path, recursive=True)
  observer.start()
  try:
      while True:
          time.sleep(1)
  except KeyboardInterrupt:
      observer.stop()
  observer.join()
