import {Component, OnInit} from '@angular/core';
import {Heroe} from "../../model/heroe.model";
import {FormGroup, NgForm} from "@angular/forms";
import {HeroesService} from "../../services/heroes.service";

import Swal from "sweetalert2";
import {Observable, timeout} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.scss']
})
export class HeroeComponent implements OnInit {

  heroe: Heroe;

  constructor(
    private heroesService: HeroesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.heroe = new Heroe();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'nuevo' && id !== null) {
      this.heroesService.getHeroe(id)
        .subscribe(resp => {
          this.heroe = resp;
        });
    }
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(c => {
        if (c instanceof FormGroup) {
          Object.values(c.controls).forEach(c2 => console.log(c2.errors))
        } else {
          console.log(c.errors);
        }
      });
      return;
    }

    Swal.fire({
      title: 'Espere por favor',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    })
    Swal.showLoading();

    let peticion: Observable<any>;

    if (this.heroe.id) {
      peticion = this.heroesService.actualizarHeroe(this.heroe);
    } else {
      peticion = this.heroesService.crearHeroe(this.heroe);
    }
    peticion.subscribe(resp => {
      Swal.fire({
        title: this.heroe.nombre,
        text: 'Se actualizó correctamente',
        icon: 'success'
      }).then(resp => {
        if (resp.value) {
          setTimeout(() => {
            this.router.navigateByUrl('/heroes');
          }, 100);
        }
      })
    })
  }

  estado(): void {
    this.heroe.vivo = !this.heroe.vivo;
  }
}
