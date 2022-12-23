import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Role } from 'src/app/model/role';

@Directive({
  selector: '[ifRole]'
})
export class IfRoleDirective{

  // the role the user must have
  @Input() set ifRole(role: Role) {
    this.authService.getUserLogged().subscribe(res => {
      if(res?.ruolo?.descrizione == role.descrizione) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    })
  }

  /**
   * @param {ViewContainerRef} viewContainerRef -- the location where we need to render the templateRef
   * @param {TemplateRef<any>} templateRef -- the templateRef to be potentially rendered
   * @param {RolesService} rolesService -- will give us access to the roles a user has
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private elementRef: ElementRef,
    private authService: AuthService
  ) {}

  // public ngOnChanges(): void {
  //   this.subscription.push(
  //     this.authService.getUserLogged().subscribe(res => {
  //       console.log(res?.ruolo?.descrizione);
  //       if (!res?.ruolo) {
  //         // Remove element from DOM
  //         this.viewContainerRef.clear();
  //       }
  //       // user Role are checked by a Roles mention in DOM
  //       if (res?.ruolo == null) {
  //         this.viewContainerRef.clear();
  //       } else {
  //         // appends the ref element to DOM and update user roles
  //         this.viewContainerRef.createEmbeddedView(this.templateRef);
  //       }
  //     })
  //   );
  // }

}
