import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 处理表单输入
import { Router, RouterLink } from '@angular/router'; // 处理跳转

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginObj: any = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  onLogin() {
    // 模拟登录逻辑
    // 之后我们会在这里连接 Backend API
    if (this.loginObj.email && this.loginObj.password) {
      // 成功登录
      alert("登录成功！欢迎来到 G5ConfEase");
      this.router.navigateByUrl('/dashboard');
    } else {
      // 失败
      alert("请输入邮箱和密码");
    }
  }
}
