import { Mission } from './../../../interfaces/common.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { MissionService } from 'src/app/main/services/mission.service';
import { APP_CONFIG } from 'src/app/main/configs/environment.config';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/main/pipes/filter.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mission-application',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, NgxPaginationModule, CommonModule, FormsModule, FilterPipe],
  templateUrl: './mission-application.component.html',
  styleUrls: ['./mission-application.component.css']
})
export class MissionApplicationComponent implements OnInit, OnDestroy {
  applicationList: any[] = [];
  searchText: any = "";
  page: number = 1;
  itemsPerPages: number = 5;
  applicationId: any;
  private unsubscribe: Subscription[] = [];

  constructor(
    private _service: MissionService,
    private _toast: NgToastService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.fetchMissionApplicationList();
  }

  getStatus(status) {
    return status ? 'Approve' : 'Pending';
  }

  fetchMissionApplicationList() {
    const missionApplicationSubscription = this._service.missionApplicationList().subscribe((data: any) => {
      if (data.result == 1) {
        console.log('Mission Application Data:', data.data);
        this.applicationList = data.data.map((item: any) => ({
          missionApplicationId: item.missionApplicationId || item.id,
          missionId: item.missionId,
          userId: item.userId,
          appliedDate: item.appliedDate,
          approvalStatus: item.approvalStatus,
          missionTitle: item.missionTitle,
          userName: item.userName,
          missionTheme: item.missionTheme,
          status: item.status
        }));
        console.log('Processed Application List:', this.applicationList);
      }
      else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
      }
    }, err => {
      console.error('Mission Application List Error:', {
        status: err?.status,
        statusText: err?.statusText,
        error: err?.error,
        message: err?.message
      });
      const errorMessage = err?.error?.message || err?.message || 'An error occurred while fetching mission applications'
      this._toast.error({ detail: "ERROR", summary: errorMessage, duration: APP_CONFIG.toastDuration });
    });
    this.unsubscribe.push(missionApplicationSubscription);
  }

  // approveMissionApplication(value: any) {
  // console.log('Clicked approve for:', value);
  // const id = value?.missionApplicationId || value?.id || value?.missionId;
  // console.log('Resolved ID:', id);

  // if (!id || isNaN(id)) {
  //   this._toast.error({
  //     detail: "ERROR",
  //     summary: "Invalid mission application ID",
  //     duration: APP_CONFIG.toastDuration
  //   });
  //   return;
  // }
  //   const missionApplicationSubscription = this._service.missionApplicationApprove(value).subscribe(
  //     (data: any) => {
  //       if (data.result == 1) {
  //         this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration });
  //         setTimeout(() => {
  //           window.location.reload();
  //         }, 2000);
  //       } else {
  //         this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
  //       }
  //     },
  //     (err) => {
  //       const errorMessage = err?.error?.message || err?.message || 'An error occurred while approving mission application'
  //       this._toast.error({ detail: "ERROR", summary: errorMessage, duration: APP_CONFIG.toastDuration });
  //     }
  //   );
  //   this.unsubscribe.push(missionApplicationSubscription);
  // }

  approveMissionApplication(value: any): void {
    const id = value?.id || value?.missionApplicationId || value?.missionId;

    if (!id || isNaN(id)) {
      this._toast.error({
        detail: "ERROR",
        summary: "Invalid mission application ID",
        duration: APP_CONFIG.toastDuration
      });
      return;
    }

    const sub = this._service.missionApplicationApprove(id).subscribe(
      (data: any) => {
        if (data.result === 1) {
          this._toast.success({
            detail: "SUCCESS",
            summary: "Application Approved",
            duration: APP_CONFIG.toastDuration
          });
          setTimeout(() => window.location.reload(), 1000);
        } else {
          this._toast.error({
            detail: "ERROR",
            summary: data.message || "Approval failed",
            duration: APP_CONFIG.toastDuration
          });
        }
      },
      (err) => {
        const errorMessage = err?.error?.message || err?.message || 'An error occurred while approving the application';
        this._toast.error({ detail: "ERROR", summary: errorMessage, duration: APP_CONFIG.toastDuration });
      }
    );

    this.unsubscribe.push(sub);
  }


  
  deleteMissionApplication(value: any) {
    console.log('Deleting mission application:', value);
    const id = value?.missionApplicationId || value?.id || value?.missionId;

    if (!id) {
      console.error('Invalid mission application data:', value);
      this._toast.error({ detail: "ERROR", summary: "Invalid mission application data", duration: APP_CONFIG.toastDuration });
      return;
    }

    console.log('Sending delete request with ID:', id);
    const missionApplicationDeleteSubscription = this._service.missionApplicationDelete(id).subscribe(
      (data: any) => {
        console.log('Delete response:', data);
        if (data.result == 1) {
          this._toast.success({ detail: "SUCCESS", summary: data.data, duration: APP_CONFIG.toastDuration });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
        }
      },
      (err) => {
        console.error('Delete Mission Application Error:', {
          status: err?.status,
          statusText: err?.statusText,
          error: err?.error,
          message: err?.message,
          url: err?.url
        });
        const errorMessage = err?.error?.message || err?.message || 'An error occurred while deleting mission application'
        this._toast.error({ detail: "ERROR", summary: errorMessage, duration: APP_CONFIG.toastDuration });
      }
    );
    this.unsubscribe.push(missionApplicationDeleteSubscription);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
