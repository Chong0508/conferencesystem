import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 定义 Session 结构
interface Session {
  id: number;
  timeStart: string; // e.g., "09:00"
  timeEnd: string;   // e.g., "10:00"
  title: string;
  speaker: string;
  venue: string;
  day: string;       // "Day 1", "Day 2"
  type: string;      // "Keynote", "Workshop", "Break"
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css'] // 确保有一个空的 CSS 文件
})
export class ScheduleComponent implements OnInit {

  sessions: Session[] = [];
  filteredSessions: Session[] = [];

  // 当前选中的天 (默认 Day 1)
  selectedDay: string = 'Day 1';
  days: string[] = ['Day 1', 'Day 2', 'Day 3'];

  // 控制 "Add Session" 表单的显示
  showForm: boolean = false;

  // 新建 Session 的模型
  newSession: Session = {
    id: 0,
    day: 'Day 1',
    timeStart: '',
    timeEnd: '',
    title: '',
    speaker: '',
    venue: '',
    type: 'Keynote'
  };

  private storageKey = 'mock_sessions';

  constructor() { }

  ngOnInit(): void {
    this.loadSessions();
  }

  // --- 读取数据 ---
  loadSessions() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.sessions = JSON.parse(data);
    } else {
      // 如果没有数据，初始化一些假数据
      this.initializeDemoSessions();
    }
    this.filterByDay();
  }

  // --- 初始化 Demo 数据 ---
  initializeDemoSessions() {
    this.sessions = [
      { id: 1, day: 'Day 1', timeStart: '08:00', timeEnd: '09:00', title: 'Registration & Breakfast', speaker: '-', venue: 'Main Hall', type: 'Break' },
      { id: 2, day: 'Day 1', timeStart: '09:00', timeEnd: '10:30', title: 'Opening Keynote: The Future of AI', speaker: 'Dr. Sarah Connor', venue: 'Auditorium A', type: 'Keynote' },
      { id: 3, day: 'Day 1', timeStart: '11:00', timeEnd: '12:30', title: 'Web Development Trends 2026', speaker: 'John Doe', venue: 'Room 101', type: 'Workshop' },
      { id: 4, day: 'Day 2', timeStart: '09:00', timeEnd: '10:00', title: 'Cloud Computing Security', speaker: 'Alice Smith', venue: 'Room 202', type: 'Panel' },
    ];
    this.saveToStorage();
  }

  // --- 按天筛选 ---
  selectDay(day: string) {
    this.selectedDay = day;
    this.filterByDay();
  }

  filterByDay() {
    // 简单的排序：按开始时间排序
    this.filteredSessions = this.sessions
      .filter(s => s.day === this.selectedDay)
      .sort((a, b) => a.timeStart.localeCompare(b.timeStart));
  }

  // --- 添加 Session ---
  toggleForm() {
    this.showForm = !this.showForm;
  }

  addSession() {
    if (this.newSession.title && this.newSession.timeStart) {
      // 1. Assign ID
      this.newSession.id = Date.now(); // 使用时间戳作为简单ID

      // 2. Push to array
      this.sessions.push({ ...this.newSession }); // 使用 spread operator 复制对象

      // 3. Save & Refresh
      this.saveToStorage();
      this.filterByDay();

      // 4. Reset Form
      this.showForm = false;
      this.resetForm();

      alert('Session added successfully!');
    } else {
      alert('Please fill in Title and Start Time.');
    }
  }

  resetForm() {
    this.newSession = { id: 0, day: this.selectedDay, timeStart: '', timeEnd: '', title: '', speaker: '', venue: '', type: 'Keynote' };
  }

  // --- 删除 Session ---
  deleteSession(id: number) {
    if (confirm('Delete this session?')) {
      this.sessions = this.sessions.filter(s => s.id !== id);
      this.saveToStorage();
      this.filterByDay();
    }
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.sessions));
  }
}
