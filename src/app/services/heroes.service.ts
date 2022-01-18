import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Heroe} from "../model/heroe.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url = 'https://loginangular-e1e1a-default-rtdb.firebaseio.com';

  constructor(
    private http: HttpClient
  ) {
  }

  borrarHeroe(id: string) {
    return this.http.delete(`${this.url}/heroes/${id}.json`);
  }

  crearHeroe(heroe: Heroe) {
    return this.http.post(`${this.url}/heroes.json`, heroe)
      .pipe(
        map((resp: any) => {
          heroe.id = resp.name;
          return heroe;
        })
      );
  }

  actualizarHeroe(heroe: Heroe) {
    const heroeTemp: Heroe = {
      ...heroe
    };
    delete heroeTemp.id;
    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemp);
  }

  getHeroe(id: string) {
    return this.http.get(`${this.url}/heroes/${id}.json`)
      .pipe(
        map((resp: any) => {
          const heroeTemp: Heroe = {
            ...resp
          }
          heroeTemp.id = id;
          return heroeTemp;
        })
      );
  }

  getHeroes() {
    return this.http.get(`${this.url}/heroes.json`)
      .pipe(
        map(this.crearArreglo)
      );
  }

  private crearArreglo(heroesOBj: object) {
    const heroes: Heroe[] = [];
    if (heroesOBj === null) {
      return [];
    }
    Object.keys(heroesOBj).forEach(key => {
      // @ts-ignore
      const heroe: Heroe = heroesOBj[key];

      heroe.id = key;
      heroes.push(heroe);
    });
    return heroes;
  }
}
