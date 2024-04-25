type JobSeeker = {
  _id: string; // uuid
  email: string;
  password: string;
  name: string;
  birthPlace: string | null;
  birthDate: string | null; // string is ISO string date (YYYY:MM:DD)
  profilePicture: string | null;
  address: string | null;
  lastEducation: 'SD' | 'SMP' | 'SMA' | 'Diploma';
  jobPreferences: [string] | null; // string is uuid of `JobPreference`
  applications: [string] | null; // string is uuid of `Job`
  experiences: [{
    companyName: string;
    year: string;
    rating: number; // number ranging 0-5
  }] | null;
};

type JobProvider = {
  _id: string; // uuid
  username: string;
  password: string;
  name: string;
  jobs: [string] | null; // string is uuid of `Job`
};

type JobPreference = {
  _id: string; // uuid
  name: string;
};

type Job = {
  _id: string; // uuid
  postedBy: string; // uuid of `JobProvider`
  postedDate: string; // ISO string date (YYYY:MM:DD)
  applicants: [{
    _id: string; // uuid of `JobSeeker`
    applyDate: string; // ISO string date (YYYY:MM:DD)
  }] | null;
  preferences: [string]; // string is uuid of `JobPreference`
  requirements: string;
  location: {
    description: string;
    map: string | null;
  },
  isNewApplicantExist: boolean;
  accepted: [{
    _id: string; // string is uuid of `JobSeeker`
    notificationMessage: string;
    isNotificationRead: boolean;
    workStatus: 'working' | 'stopped';
  }] | null;
  status: 'open' | 'closed';
  salary: number;
  workHours: {
    start: string; // ISO string date (HH:MM)
    end: string; // ISO string date (HH:MM)
  };
};
