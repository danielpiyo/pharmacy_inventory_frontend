import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/_service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  public todoList:Array<any>;
  public newTodoText:string = '';
  
  constructor(
    private toDoService: TodoService
  ) { 
    this.todoList = this.toDoService.getTodoList()
  }

  ngOnInit() {
  }

  public  getNotDeleted() { 
    return this.todoList.filter((item:any) => {
      return !item.deleted
    })
  }

  public addToDoItem($event) {
    if (($event.which === 1 || $event.which === 13) && this.newTodoText.trim() != '') {
      this.todoList.unshift({
          text: this.newTodoText
      });
      this.newTodoText = '';
    }
  }

}
