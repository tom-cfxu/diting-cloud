import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveUserService {
  public setUser(
    id?: string,
    username?: string,
    email?: string,
    phone?: string,
    parentId?: string,
    path?: string,
    password?: string,
    folderName?: string,
    roleName?: string
  ) {
    const storage = window.localStorage;
    const user = {
      id,
      username,
      email,
      phone,
      parentId,
      path,
      password,
      folderName,
      roleName
    }
    storage.setItem('savaUser', JSON.stringify(user))
  }
  getUser() {
    const storage: any = JSON.parse(window.localStorage.getItem('savaUser'));
    return storage
  }
  constructor() { }
}
