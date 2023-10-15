import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { keys as __keys, pickBy as __pickBy, intersection as __intersection} from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { iTalUser } from '@app/model/user';
import { Organisation } from '@app/model/organisation';

import { AppClaimDomains } from '@app/private/model/access-control';

import { UserStore } from '@app/state/user';
import { OrganisationService } from '@app/private/state/organisation/main';
import { CLMUsersService } from '@app/private/state/user/base';
import { TIME_AGO } from '@app/features/convs-mgr/conversations/chats';

import { NewUserDialogComponent } from '../../modals/new-user-dialog/new-user-dialog.component';
import { UpdateUserModalComponent } from '../../modals/update-user-modal/update-user-modal.component';





const DATA: iTalUser[] = []

@Component({
  selector: 'clm-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  private _sbS = new SubSink();

  org: Organisation;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['select', 'name', 'email', 'activity', 'roles', 'actions'];

  dataSource = new MatTableDataSource(DATA);

  searchFormGroup: FormGroup;

  orgLoaded: boolean;

  orgRoles: string[];
  
  readonly CAN_PERFOM_ADMIN_ACTIONS = AppClaimDomains.Admin;
  selection = new SelectionModel<iTalUser>(true, []);

  constructor(private _fb: FormBuilder,
              private dialog: MatDialog,
              private _orgsService$$: OrganisationService,
              private _users$$: UserStore,
              private _usersService$$: CLMUsersService,
              private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildSearchFormGroup();
    this.getOrg();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const sortState: Sort = { active: 'fullName', direction: 'asc' };

    if (this.sort) {
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }

    this.cdref.detectChanges();
  }

  buildSearchFormGroup() {
    this.searchFormGroup = this._fb.group({
      role: [[]]
    })
  }

  getOrg() {
    this._orgsService$$.getActiveOrg().subscribe((org) => {
      if (org) {
        this.orgLoaded = true;
        this.org = org;
        this._getOrgUsers(org.id!);
        this.orgRoles = org.roles;
      }
    });
  }

  getRoles(roles: {}): string[] {
    return __keys(__pickBy(roles));
  }
  
  onRoleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedRole = target.value;
  
    // Now you can use the 'selectedRole' in your logic
    console.log(selectedRole);
  
  }

  private _getOrgUsers(orgId: string) {
    this._sbS.sink = combineLatest([
      this._users$$.getOrgUsers(orgId),
      this.searchFormGroup.controls['role'].valueChanges.pipe(startWith(''))
    ]).subscribe(([users, role]) => {
      // Filter users based on the selected role (e.g., 'viewer')
      const filteredUsers = users.filter((user) => {
        let userRoles = __keys(__pickBy(user.roles[user.activeOrg]));
        userRoles = this.removeItem(userRoles);
        return role == '' ? true : userRoles.includes(role);
      });
  
      this.dataSource.data = filteredUsers;
    });
  }
  
  

  removeItem(roles: string[]) {
    let data  = ['access', 'principal'];
    data.forEach((el) => {
      let index = roles.indexOf(el);
      if (index > -1) {
        roles.splice(index, 1);
      }
    })
    return roles;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDate(date: any): string {
    return TIME_AGO(date.seconds);
  }

  inviteMember() {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      minWidth: '500px',
      minHeight: '200px',
      data: this.org
    });
  }

  updateUserDetails(user: iTalUser) {
    const dialogRef = this.dialog.open(UpdateUserModalComponent, {
      minWidth: '500px',
      minHeight: '200px',
      data: {
        org : this.org,
        user: user
      }
    });
  }

  

  toggleAll(event: any) {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
    } else {
      this.selection.clear();
    }
  }

  toggleSelection(event: any, user: iTalUser) {
    event.checked ? this.selection.select(user) : this.selection.deselect(user);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSelected(user: iTalUser) {
    return this.selection.isSelected(user);
  }

  removerUser(user: iTalUser) {
    this._orgsService$$.removeUserFromOrg(user);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
