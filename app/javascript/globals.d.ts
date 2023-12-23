type Channel = {
  perform: (action: string, data: any) => void;
};

interface Window {
  RobotChannel: Channel;

  WorkChannel: Channel;
}

