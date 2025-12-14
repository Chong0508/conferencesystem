import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-conference',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './create-conference.html',
  styleUrl: './create-conference.css',
})
export class CreateConference {
}
