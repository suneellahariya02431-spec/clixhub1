import { Club, Applicant, Registration, Event, AuditLog, User, Role, ClubRole, Inquiry, SavedEvent, Message, Notification, SessionArchive, TeamMember, Mentor, DevConfig, PollOption, Venue } from './types';
import { DEMO_USERS, CLUBS, EVENTS, INITIAL_APPLICANTS, INITIAL_REGISTRATIONS, INITIAL_AUDIT_LOGS, INITIAL_VENUES } from './constants';

// --- Helpers for Chat Mapping ---
const mapMessageFromDB = (dbMsg: any): Message => ({
    id: dbMsg.id,
    senderId: dbMsg.senderId,
    senderName: dbMsg.senderName,
    content: dbMsg.content,
    timestamp: dbMsg.timestamp,
    clubId: dbMsg.clubId,
    recipientId: dbMsg.recipientId,
    type: dbMsg.type as any,
    status: 'sent',
    mediaUrl: dbMsg.mediaUrl,
    latitude: dbMsg.latitude,
    longitude: dbMsg.longitude,
    pollQuestion: dbMsg.pollQuestion,
    pollOptions: dbMsg.pollOptions
});

const mapMessageToDB = (msg: Message) => ({
    id: msg.id,
    senderId: msg.senderId,
    senderName: msg.senderName,
    content: msg.content,
    timestamp: msg.timestamp,
    clubId: msg.clubId,
    recipientId: msg.recipientId,
    type: msg.type,
    mediaUrl: msg.mediaUrl,
    latitude: msg.latitude,
    longitude: msg.longitude,
    pollQuestion: msg.pollQuestion,
    pollOptions: msg.pollOptions
});

class InstitutionalAPI {
  private STORAGE_PREFIX = 'MITS_CCMS_V2_';

  async initialize(): Promise<void> {
    console.log("Institutional Mainframe Connected: Local Mode Active");
  }

  private getLocal<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`${this.STORAGE_PREFIX}${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  private setLocal<T>(key: string, value: T) {
    try {
      localStorage.setItem(`${this.STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      // Ignore storage errors
    }
  }

  // --- USERS ---
  async getUsers(): Promise<User[]> {
    return this.getLocal('users', DEMO_USERS);
  }

  async getUser(id: string): Promise<User | undefined> {
    const users = this.getLocal<User[]>('users', DEMO_USERS);
    return users.find(u => u.id === id);
  }

  async saveUser(user: User): Promise<void> {
    const users = this.getLocal<User[]>('users', DEMO_USERS);
    const updatedUsers = users.some(u => u.id === user.id) 
        ? users.map(u => u.id === user.id ? user : u) 
        : [...users, user];
    this.setLocal('users', updatedUsers);
  }

  async updateUser(user: User): Promise<void> {
    return this.saveUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    const users = this.getLocal<User[]>('users', DEMO_USERS);
    this.setLocal('users', users.filter(u => u.id !== id));
  }

  getUserStatus(userId: string) {
      const isOnline = Math.random() > 0.5;
      const lastSeen = new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString();
      return { isOnline, lastSeen };
  }

  // --- AUTH ---
  async login(email: string, password: string): Promise<{ token: string, user: User }> {
    // Simulate login
    const users = await this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
        // In a real app, verify password. Here we accept any password for demo users.
        // For security in a real app, never do this.
        const token = `mock-token-${user.id}-${Date.now()}`;
        localStorage.setItem('authToken', token);
        return { token, user };
    }
    throw new Error('User not found');
  }

  async register(data: any): Promise<{ token: string, user: User }> {
    const users = await this.getUsers();
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('User already registered. Please sign in.');
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        globalRole: Role.STUDENT,
        clubMemberships: [],
        enrollmentNumber: data.enrollmentNumber
    };

    await this.saveUser(newUser);
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem('authToken', token);
    return { token, user: newUser };
  }

  async resetPasswordForEmail(email: string): Promise<void> {
    console.log(`Password reset requested for ${email}`);
    // Simulate success
  }

  async sendMagicLink(email: string): Promise<void> {
    console.log(`Magic link requested for ${email}`);
    // Simulate success
  }

  async updatePassword(password: string): Promise<void> {
    console.log(`Password updated`);
    // Simulate success
  }

  // --- CLUBS ---
  async getClubs(): Promise<Club[]> {
    return this.getLocal('clubs', CLUBS);
  }

  async saveClub(club: Club): Promise<void> {
    const clubs = this.getLocal<Club[]>('clubs', CLUBS);
    const updatedClubs = clubs.some(c => c.id === club.id) 
        ? clubs.map(c => c.id === club.id ? club : c) 
        : [...clubs, club];
    this.setLocal('clubs', updatedClubs);
  }

  async updateClub(club: Club): Promise<void> {
    return this.saveClub(club);
  }

  async toggleClubFreeze(clubId: string): Promise<void> {
      const clubs = await this.getClubs();
      const club = clubs.find(c => c.id === clubId);
      if (club) {
          await this.saveClub({ ...club, isFrozen: !club.isFrozen });
      }
  }

  async appointPresident(clubId: string, studentId: string): Promise<void> {
      const clubs = await this.getClubs();
      const club = clubs.find(c => c.id === clubId);
      if (club) {
          const user = await this.getUser(studentId);
          if (user) {
             const newLeadership = { ...club.leadership, "President": user.name };
             await this.saveClub({ ...club, leadership: newLeadership });
          }
      }
  }

  async assignFaculty(clubId: string, faculty: User): Promise<void> {
      const clubs = await this.getClubs();
      const club = clubs.find(c => c.id === clubId);
      if (club) {
          await this.saveClub({ 
              ...club, 
              facultyCoordinatorId: faculty.id,
              facultyCoordinatorNames: [faculty.name]
          });
      }
  }

  // --- EVENTS ---
  async getEvents(): Promise<Event[]> {
    return this.getLocal('events', EVENTS);
  }

  async saveEvent(event: Event): Promise<void> {
    const events = this.getLocal<Event[]>('events', EVENTS);
    const updatedEvents = events.some(e => e.id === event.id) 
        ? events.map(e => e.id === event.id ? event : e) 
        : [...events, event];
    this.setLocal('events', updatedEvents);
  }

  async deleteEvent(eventId: string): Promise<void> {
    const events = this.getLocal<Event[]>('events', EVENTS);
    this.setLocal('events', events.filter(e => e.id !== eventId));
  }
  
  async approveEvent(eventId: string): Promise<void> {
      const events = await this.getEvents();
      const event = events.find(e => e.id === eventId);
      if (event) {
          await this.saveEvent({ ...event, status: 'Approved' });
      }
  }

  // --- REGISTRATIONS ---
  async getRegistrations(): Promise<Registration[]> {
    return this.getLocal('registrations', INITIAL_REGISTRATIONS);
  }

  async saveRegistration(reg: Registration): Promise<void> {
    const regs = this.getLocal<Registration[]>('registrations', INITIAL_REGISTRATIONS);
    const updatedRegs = regs.some(r => r.id === reg.id) 
        ? regs.map(r => r.id === reg.id ? reg : r) 
        : [...regs, reg];
    this.setLocal('registrations', updatedRegs);
  }

  async generateCertificate(registrationId: string): Promise<string | null> {
    const registrations = await this.getRegistrations();
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg || !reg.attendanceMarked) return null;

    const certId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const certificateUrl = `/certificate/${certId}`;

    await this.saveRegistration({
        ...reg,
        certificateId: certId,
        certificateUrl: certificateUrl
    });

    return certificateUrl;
  }

  // --- APPLICANTS ---
  async getApplicants(): Promise<Applicant[]> {
    return this.getLocal('applicants', INITIAL_APPLICANTS);
  }

  async saveApplicant(app: Applicant): Promise<void> {
      const apps = this.getLocal<Applicant[]>('applicants', INITIAL_APPLICANTS);
      const updatedApps = apps.some(a => a.id === app.id) 
          ? apps.map(a => a.id === app.id ? app : a) 
          : [...apps, app];
      this.setLocal('applicants', updatedApps);
  }
  
  async updateApplicant(app: Applicant): Promise<void> {
      return this.saveApplicant(app);
  }

  // --- LOGS ---
  async getLogs(): Promise<AuditLog[]> {
    return this.getLocal('logs', INITIAL_AUDIT_LOGS);
  }

  async addLog(log: AuditLog): Promise<void> {
      const logs = this.getLocal<AuditLog[]>('logs', INITIAL_AUDIT_LOGS);
      this.setLocal('logs', [log, ...logs]);
  }

  // --- MESSAGES ---
  async getMessages(clubId?: string, userId?: string, otherUserId?: string): Promise<Message[]> {
      const msgs = this.getLocal<Message[]>('messages', []);
      if (clubId) return msgs.filter(m => m.clubId === clubId);
      if (userId && otherUserId) {
          return msgs.filter(m => (m.senderId === userId && m.recipientId === otherUserId) || (m.senderId === otherUserId && m.recipientId === userId));
      }
      return [];
  }

  async sendMessage(msg: Message): Promise<void> {
      const msgs = this.getLocal<Message[]>('messages', []);
      this.setLocal('messages', [...msgs, msg]);
  }

  // --- SAVED EVENTS ---
  async getSavedEvents(userId: string): Promise<SavedEvent[]> {
      const saved = this.getLocal<SavedEvent[]>('saved_events', []);
      return saved.filter(s => s.userId === userId);
  }

  async toggleSavedEvent(userId: string, eventId: string): Promise<void> {
      const saved = this.getLocal<SavedEvent[]>('saved_events', []);
      const exists = saved.some(s => s.userId === userId && s.eventId === eventId);
      if (exists) {
          this.setLocal('saved_events', saved.filter(s => !(s.userId === userId && s.eventId === eventId)));
      } else {
          this.setLocal('saved_events', [...saved, { userId, eventId }]);
      }
  }

  // --- VENUES ---
  async getVenues(): Promise<Venue[]> {
    return this.getLocal('venues', INITIAL_VENUES);
  }

  async saveVenue(venue: Venue): Promise<void> {
      const venues = this.getLocal<Venue[]>('venues', INITIAL_VENUES);
      this.setLocal('venues', [...venues, venue]);
  }

  async deleteVenue(id: string): Promise<void> {
      const venues = this.getLocal<Venue[]>('venues', INITIAL_VENUES);
      this.setLocal('venues', venues.filter(v => v.id !== id));
  }

  // --- DEVELOPERS ---
  async getDevelopers(): Promise<TeamMember[]> {
    return this.getLocal('developers', []);
  }

  async saveDeveloper(dev: TeamMember): Promise<void> {
      const devs = this.getLocal<TeamMember[]>('developers', []);
      this.setLocal('developers', [...devs, dev]);
  }

  async deleteDeveloper(id: string): Promise<void> {
      const devs = this.getLocal<TeamMember[]>('developers', []);
      this.setLocal('developers', devs.filter(d => d.id !== id));
  }

  // --- MENTORS ---
  async getMentors(): Promise<Mentor[]> {
    return this.getLocal('mentors', []);
  }

  async saveMentor(mentor: Mentor): Promise<void> {
      const mentors = this.getLocal<Mentor[]>('mentors', []);
      this.setLocal('mentors', [...mentors, mentor]);
  }

  async deleteMentor(id: string): Promise<void> {
      const mentors = this.getLocal<Mentor[]>('mentors', []);
      this.setLocal('mentors', mentors.filter(m => m.id !== id));
  }

  // --- CONFIG ---
  async getDevConfig(): Promise<DevConfig> {
    return this.getLocal('dev_config', { developedUnderName: 'BDC', developedUnderUrl: '#', authorizedEmails: [] });
  }

  async saveDevConfig(config: DevConfig): Promise<void> {
      this.setLocal('dev_config', config);
  }

  // --- NOTIFICATIONS ---
  async sendNotification(notif: Notification): Promise<void> {
    const notifs = this.getLocal<Notification[]>('notifications', []);
    this.setLocal('notifications', [...notifs, notif]);
  }

  // --- MESSAGES (Realtime Stubs) ---
  subscribeToMessages(callback: (msg: Message) => void): any {
      // No-op for local mode
      return null;
  }

  unsubscribe(channel: any) {
      // No-op
  }

  generateRandomPassword() {
      return Math.random().toString(36).slice(-8).toUpperCase();
  }
  
  // --- FOOTER CONFIGURATION ---
  async getFooterConfig(): Promise<any> {
    const stored = localStorage.getItem('clix_footer_config');
    if (stored) return JSON.parse(stored);
    
    // Default Config
    return {
      socialLinks: [
        { id: 's1', platform: 'Instagram', url: "https://www.instagram.com/mits_gwalior/?hl=en", icon: 'Instagram' },
        { id: 's2', platform: 'YouTube', url: "https://www.youtube.com/channel/UCKmCxK6awxsc4sV9PPETwHg/videos", icon: 'Youtube' },
        { id: 's3', platform: 'LinkedIn', url: "https://www.linkedin.com/school/mitsdugwalior/posts/?feedView=all", icon: 'Linkedin' },
        { id: 's4', platform: 'X (Twitter)', url: "https://x.com/MITS_Gwalior", icon: 'Twitter' },
        { id: 's5', platform: 'Facebook', url: "https://www.facebook.com/MitsMadhavIstituteOfTechnologyScienceGwalior/", icon: 'Facebook' }
      ],
      institutionalLinks: [
        { id: 'i1', label: "Moodle (New)", url: "http://moodle.mitsweb.in/", icon: 'GraduationCap' },
        { id: 'i2', label: "Moodle (Legacy)", url: "http://moodle.mitsgwalior.in/", icon: 'GraduationCap' },
        { id: 'i3', label: "SDMS Portal", url: "https://sdms.mitsgwalior.in/", icon: 'Layout' },
        { id: 'i4', label: "IUMS Portal", url: "https://iums.mitsgwalior.in/", icon: 'Database' },
        { id: 'i5', label: "AMS (Attendance)", url: "https://ams.mitsgwalior.in/", icon: 'Calendar' },
        { id: 'i6', label: "SAR Portal", url: "https://sar.mitsgwalior.in/", icon: 'FileText' },
      ],
      contactInfo: {
        address: "Madhav Institute of Technology & Science (MITS), Gola ka Mandir, Gwalior - 474005, Madhya Pradesh, India",
        email: "vicechancellor@mitsgwalior.in",
        phones: ["0751-240-9354", "0751-240-9300"]
      }
    };
  }

  async saveFooterConfig(config: any): Promise<void> {
    localStorage.setItem('clix_footer_config', JSON.stringify(config));
  }

  // --- BULK USER OPERATIONS ---
  async massImportUsers(users: User[]): Promise<void> {
    const currentUsers = await this.getUsers();
    // Merge and deduplicate by email
    const emailMap = new Map(currentUsers.map(u => [u.email, u]));
    users.forEach(u => emailMap.set(u.email, { ...u, id: u.id || `user-${Date.now()}-${Math.random()}` }));
    
    const newUsers = Array.from(emailMap.values());
    this.setLocal('users', newUsers);
  }

  async getAllUserCredentials(): Promise<any[]> {
    const users = await this.getUsers();
    return users;
  }
}

export const db = new InstitutionalAPI();
