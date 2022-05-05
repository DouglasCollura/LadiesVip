import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { ControlService } from 'src/app/services/control/control.service';
import { ConfigService } from 'src/app/services/config/config.service';

declare var $: any;

@Component({
    selector: 'app-anuncio',
    templateUrl: './anuncio.component.html',
    styleUrls: ['./anuncio.component.scss']
})
export class AnuncioComponent implements OnInit {

    constructor(
        private AnunciosService:AnunciosService,
        private ControlService:ControlService,
        private ConfigService:ConfigService
    ) { }

    ngOnInit(): void {
        if(this.AnunciosService.anuncio){
            this.PrepararAnuncio(this.AnunciosService.anuncio)
        }

        if(sessionStorage.getItem("usuario")){
            this.datos = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
        }else{
            this.datos = JSON.parse(localStorage.getItem("usuario") || '{}' )
        }
    }


    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    datos:any;
    urls_image=[];
    //?GESTION=================================================================================
    id:any=null;
    anuncio:any={
        intereses:"",
        descripcion:"",
        hab_notificacion:false,
        hab_chat:false,
        hab_wts:false
    };
    formData = new FormData();
    img_length=0;
    intereses_name:any=[];
    user_imagen_show:any=[];

    urls_delete:any=[];
    
    //?CONTROL=================================================================================
    menu:boolean=false;
    display_interes:boolean=false;
    ctrl_intereses: any = [];
    url = environment.server;

    isFirstAdd:boolean=true;
    isFirstBoost:boolean=true;

    loading:boolean=false;
    done:boolean=false;


        //!FUNCIONES===========================================================================================================


    //?GESTION=================================================================================

    selectIdentidad(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_intereses.push(id);
            this.intereses_name.push(event.target.textContent)
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_intereses.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
            });

            this.intereses_name.forEach(function (car: any, index: any, object: any) {
                if (car == event.target.textContent) {
                    object.splice(index, 1);
                }
            });
        }
    }

    SelectImg() {
        $("#img").trigger("click");
    }

    CargarImagen(event: any) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.user_imagen_show.push({img:e.target.result, id:this.img_length+1});
        }
        reader.readAsDataURL(event.target.files[0]);
        let formData = new FormData();
        let file = event.target.files[0];
        this.img_length+=1;
        this.formData.append("imagen"+this.img_length, file);
    }
        // Camera.getPhoto({
        //     quality: 40,
        //     source: CameraSource.Photos,
        //     resultType: CameraResultType.Uri
        // }).then(async res=>{
        //     console.log(res);
        //     let blob = await fetch(res.webPath).then(r => r.blob());
        //     const reader = new FileReader();
        //     reader.onload = (e: any) => {
        //         this.user_imagen_show.push({img:e.target.result, id:this.img_length+1});
        //     }
        //     reader.readAsDataURL(blob);
        //     this.img_length+=1;

        //     this.formData.append("imagen"+this.img_length, blob);
            
        // });
 

    CrearAnuncio(){
        this.anuncio.intereses = this.ctrl_intereses.join();
        this.formData.append("length", ""+this.img_length);
        this.formData.append("anuncio",JSON.stringify(this.anuncio))
        this.loading= true;
        this.AnunciosService.CrearAnuncio(this.formData).then(()=>{
            this.loading= false;
            this.done = true;
        })
    }

    UpdateAnuncio(){
        this.anuncio.intereses = this.ctrl_intereses.join();
        this.formData.append("length", ""+this.img_length);
        this.formData.append("anuncio",JSON.stringify(this.anuncio))
        this.formData.append("img_delete",JSON.stringify(this.urls_delete))
        this.AnunciosService.UpdateAnuncio(this.formData,this.id).then((res)=>{
            console.log(res)
        })
    }

    PrepararAnuncio(anuncio:any){
        this.isFirstAdd = false;
        this.anuncio.hab_notificacion = anuncio.hab_notificacion;
        this.anuncio.hab_chat = anuncio.hab_chat;
        this.anuncio.hab_wts = anuncio.hab_wts;
        this.anuncio.descripcion = anuncio.descripcion;
        this.urls_image = anuncio.urls.split(",");
        this.id = anuncio.id;
        this.ctrl_intereses = anuncio.intereses.split(",");
        
        for (const interes in this.ctrl_intereses) {
            
            this.intereses_name.push(this.ControlService.generos[parseInt(interes)])
            
        }

    }

    DeleteImg(img:any, tipo:number){
        if(tipo == 1){
            this.urls_image.forEach((car: any, index: any, object: any) => {

                if (car == img) {
                    this.urls_delete.push(img);
                    object.splice(index, 1);
                }
            });
        }else{
            this.user_imagen_show.forEach((car: any, index: any, object: any) => {
    
                if (car.id == img.id) {
                    object.splice(index, 1);
                    this.formData.delete("imagen"+img);
                }
            });
        }

    }

    //?CONTROL=================================================================================

    check(event:any){
        console.log(event)
    }

    filtrarSelect(id:any){
        var res = this.ctrl_intereses.filter((res: any) => res == id);
        return res.length > 0 ? true:false;
    }

    CerrarModal(){
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_interes = false;
        }, 450)
    }

    change(tipo:number){
        if(tipo == 1){
            this.anuncio.hab_notificacion = !this.anuncio.hab_notificacion;
        }

        if(tipo == 2){
            this.anuncio.hab_chat = !this.anuncio.hab_chat;
        }

        if(tipo == 3){
            this.anuncio.hab_wts = !this.anuncio.hab_wts;
        }
        console.log(this.anuncio.hab_notificacion)
    }

    Done(){
        this.done = false;
    }

    Close(){
        this.ConfigService.toggleProfile()
    }

}
