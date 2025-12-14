import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar'; // <-- Import Navbar
import { Sidebar } from './components/sidebar/sidebar'; // <-- Import Sidebar

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Sidebar], // <-- Tambah Navbar & Sidebar di sini
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'my-app';
}
