import {Component, OnInit} from '@angular/core';
import {HeroesService} from "../../services/heroes.service";
import {Heroe} from "../../model/heroe.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes: Heroe[];
  cargando: boolean;

  constructor(
    private heroesService: HeroesService
  ) {
    this.heroes = [];
    this.cargando = false;
  }

  ngOnInit(): void {
    this.cargando = true;
    this.heroesService.getHeroes()
      .subscribe(resp => {
          this.heroes = resp;
          this.cargando = false;
        }
      );
  }

  borrarHeroe(heroe: Heroe, i: number) {
    Swal.fire({
      title: 'Borrar heroe',
      text: `Está seguro que desea borrar a ${heroe.nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        if (heroe.id === undefined) {
          return;
        }
        this.heroesService.borrarHeroe(heroe.id).subscribe(resp => {
          this.heroes.splice(i, 1);
        });
      }
    })
  }
}
