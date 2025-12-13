import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // 👈 只需要引入这个

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink], // 👈 记得注册
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  // 首页不需要什么逻辑代码，空的就行
}
