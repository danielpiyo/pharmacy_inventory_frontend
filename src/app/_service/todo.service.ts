import { Injectable } from '@angular/core';

@Injectable()
export class TodoService {

  private _todoListUser = [
    { text: 'Ensure To check the expirey date of all the products you sell out' },
    { text: 'Ensure that you calculate the amount sold and compare with your systems log'},
    { text: 'Please take care of yourself and remember to be watchful of frouders'}
  ];

  private _todoListAdmin = [
    { text: '' }, 
    { text: ''},  
    { text: ''}
  ];


  getTodoList() {
    return this._todoListUser;
  }

  getTodoListTechnician(){
    return this._todoListAdmin;
  }
}
