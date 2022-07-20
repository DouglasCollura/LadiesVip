import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CreateMarketService } from './create-market.service';
import { environment } from 'src/environments/environment';
import { ControlService } from 'src/app/services/control/control.service';
import { Vacio, VacioU, SoloLetra, SoloNumero  } from '../../../../../../assets/script/general';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { AdminService } from 'src/app/services/admin/admin.service';


declare var $: any;


@Component({
    selector: 'app-create-market',
    templateUrl: './create-market.component.html',
    styleUrls: ['./create-market.component.scss']
})
export class CreateMarketComponent implements OnInit {

    @ViewChild('map_canvas',{static:false}) mapElement: ElementRef | any;
    @Output() Cerrar = new EventEmitter<any>();
    @Output() PushN = new EventEmitter<any>();

    constructor(
        private CreateMarketService:CreateMarketService,
        private ControlService:ControlService,
        private GeoLocationService:GeoLocationService,
        private AdminService:AdminService
    ) { }

    ngOnInit(): void {
        navigator.geolocation.getCurrentPosition((position) => {
            this.lat= position.coords.latitude;
            this.lng= position.coords.longitude;
            console.log("asdsd", position.coords.latitude)
        });
        this.GeoLocationService.getStates('Spain').then(res => {
            this.estados = res;
            this.loading = false;
        });
        console.log("negocio")
        console.log(this.CreateMarketService.negocio)
        this.show_negocio=this.CreateMarketService.negocio;
        if(!this.CreateMarketService.new){
            this.fase=1;
            this.OpenUpdate()
            this.usuario = this.show_negocio.user;
            this.new=false;
        }else{
            if(this.CreateMarketService.user_id){
                this.fase = 1;
            }
        }
    }


    //!DATA===========================================================================================================
    //?CARGA=================================================================================

    map: any;
    locaciones: any = null;
    estados: any = null;
    ciudades: any = null;
    lat=0;
    lng=0; 

    //?GESTION=================================================================================

    negocio:any={
        p1:{
            nombre:null,
            categoria:null,
            telefono:null,
            pagina:null,
            descripcion:null,
            usuario_nombre:null,
            usuario_email:null   
        },
        p2:{
            direccion:null,
            pais:'Spain',
            estado:null,
            ciudad:null,
            latitud:null,
            longitud:null
        },

    }

    usuario:any;


    fase:number=0;
    paso:number=1;
    new:boolean=true;
    formData = new FormData();
    img_length=0;
    intereses_name:any=[];
    user_imagen_show:any=[];
    user_imagen_load:any=[];
    user_imagen_new:any=[];
    urls_delete:any=[];
    show_negocio:any;

    //?CONTROL=================================================================================
    filtro:string="";
    url = environment.server;
    loading:boolean=false;
    ctrl_servicios: any = [];
    servicios_name:any="";
    display_estado:boolean=false;
    display_ciudad:boolean=false;
    estado_filtro:any=[];
    ciudad_filtro:any=[];
    //!FUNCIONES===========================================================================================================
    //?CARGA=================================================================================
    async initMap() {

        if( VacioU(this.negocio.p2.latitud)){
            this.negocio.p2.latitud = this.lat;
            this.negocio.p2.longitud =this.lng;
            
        }else{
            let arrLong=this.negocio.p2.latitud.split(".");
            this.lng = parseFloat( this.negocio.p2.longitud);
            this.lat =  parseFloat( this.negocio.p2.latitud); 
            console.log("latitud:"+ parseFloat( this.negocio.p2.latitud) + " long:"+ parseFloat( this.negocio.p2.longitud))
        }
        
        var latLng = new google.maps.LatLng(this.lat ,this.lng);
        console.log("latLng:"+latLng)
        this.map = new google.maps.Map(this.mapElement.nativeElement);
        var mapOptions = {
        center: latLng,
        zoom: 17,
        controls: {
            'myLocationButton': true,
            'myLocation': true
        },
        styles: [
            {
            "featureType": "all",
            "stylers": [
                { "visiblity": "hidden" }
            ]
            }
        ],
        disableDefaultUI: true
        };
        this.map.setOptions(mapOptions);

        let marker = new google.maps.Marker({
            position: {lat:this.lat, lng:this.lng},
            map: this.map,
            draggable: true,
            title: 'Ma position',
            icon: 'assets/my_location.png'
            });

        google.maps.event.addListener(this.map, 'click', (evt:any) =>{
            var pos = {
                lat: evt.latLng.lat(),
                lng: evt.latLng.lng()
            };
            marker.setPosition(pos);
            this.negocio.p2.latitud = pos.lat;
            this.negocio.p2.longitud = pos.lng;
            // this.map.setCenter(pos);

            console.log(evt.latLng.lat() + ' Current Lng: ' + evt.latLng.lng())
        })
        
        
    }

    CargarEstados() {
        this.estados = null;
        this.ciudades = null;
        this.negocio.p2.estado = null;
        this.negocio.p2.ciudad = null;
        this.loading = true;
        this.GeoLocationService.getStates(this.negocio.p2.pais).then(res => {
            this.estados = res;
            this.loading = false;
        });
    }

    CargarCiudad() {
        this.ciudades = null;
        this.negocio.p2.ciudad = null;
        this.loading = true;
        this.GeoLocationService.getCities(this.negocio.p2.estado).then(res => {
            this.ciudades = res;
            this.loading = false;
        });
    }

    //?GESTION=================================================================================
    SelectImg() {
        $("#img").trigger("click");
    }

    CargarImagen(event: any) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        let file = event.target.files[0];

        reader.onload = (e: any) => {
            this.user_imagen_show.push({img:e.target.result, id:this.img_length+1,blob:file});
        }
    }

    DeleteImg(img:any, tipo:number){
        if(tipo == 1){
            this.user_imagen_load.forEach((car: any, index: any, object: any) => {
                
                if (car == img) {
                    this.urls_delete.push(img);
                    object.splice(index, 1);
                }
            });
            this.user_imagen_show.forEach((car: any, index: any, object: any) => {
               
                if (car == img) {
                    object.splice(index, 1);
                }
            });
        }else{
            this.user_imagen_show.forEach((car: any, index: any, object: any) => {

                if (car == img) {
                    object.splice(index, 1);
                }
            });

        }

    }

    CrearNegocio(){

        this.user_imagen_show.forEach((car: any, index: any, object: any) => {
            if(car.blob){
                this.img_length+=1;
                this.formData.append("imagen"+this.img_length, car.blob);
            }
        })
        this.formData.append("length", ""+this.img_length);
        this.formData.append("negocio",JSON.stringify(this.negocio))
        if(this.CreateMarketService.user_id){
            this.formData.append("user_id",JSON.stringify(this.CreateMarketService.user_id))
        }
        this.loading=true;
        this.AdminService.CreateNegocios(this.formData).then(res=>{
            this.Limpiar()
            this.loading=false;
            this.CreateMarketService.negocio= res;
            console.log(res)
            this.PushN.emit(res)
            this.Close()
        });
    }

    UpdateNegocio(){
        this.negocio.p2.latitud = this.negocio.p2.latitud.toString();
        this.negocio.p2.longitud = this.negocio.p2.longitud.toString();
        
        this.user_imagen_show.forEach((car: any, index: any, object: any) => {
            if(car.blob){
                this.img_length+=1;
                this.formData.append("imagen"+this.img_length, car.blob);
            }
        })

        this.formData.append("length", ""+this.img_length);
        this.formData.append("negocio",JSON.stringify(this.negocio))
        this.formData.append("img_delete",JSON.stringify(this.urls_delete ))
        this.formData.append("user_id",JSON.stringify(this.negocio.user_id ))
        this.loading=true;
        this.AdminService.EditarNegocios(this.formData, this.show_negocio.id).then(res=>{   
            this.loading=false;
            this.Limpiar()
            this.CreateMarketService.negocio= res
            this.Close()
        });
        // this.NegociosService.UpdateNegocio(this.show_negocio.id, this.formData).then(res=>{
        //     this.CargarNegocios().then(res=>{
        //         this.Limpiar();
        //         this.display_create = false;
        //         this.display_main = true;
        //     })
        // });
    }

    OpenUpdate(){
        this.negocio.p1.nombre = this.show_negocio.nombre;
        this.negocio.p1.categoria = this.show_negocio.categoria;
        this.negocio.p1.telefono = this.show_negocio.telefono;
        this.negocio.p1.pagina = this.show_negocio.web;
        this.negocio.p1.descripcion = this.show_negocio.descripcion;
        this.negocio.p2.direccion = this.show_negocio.direccion;
        this.negocio.p2.pais = this.show_negocio.pais;
        this.negocio.p2.estado = this.show_negocio.estado;
        this.negocio.p2.ciudad = this.show_negocio.ciudad;
        this.negocio.p2.latitud = this.show_negocio.latitud;
        this.negocio.p2.longitud = this.show_negocio.longitud;
        this.ctrl_servicios.push(this.show_negocio.categoria);
        this.servicios_name = this.ControlService.servicios[this.show_negocio.categoria];
        this.user_imagen_show= this.show_negocio.images.split(',');
        this.user_imagen_load= this.show_negocio.images.split(',');
        this.negocio.p1.usuario_email='null'
        this.negocio.p1.usuario_nombre='null'
    }


    SelectEstado(estado:string){
        this.negocio.p2.estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
    }

    SelectCiudad(ciudad:string){
        this.negocio.p2.ciudad = ciudad;
        this.CerrarModal();
    }


    //?CONTROL=================================================================================

    GetFirstPhoto(negocio:any){
        let urls_image = negocio.images.split(",");
        return urls_image[0]
    }

    filtrar(){

        if(this.display_estado){
            this.estado_filtro = [];
            this.estados.forEach((arrayItem:any)=> {
                if(arrayItem.state_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.estado_filtro.push(arrayItem)
                }
            });
        }else{
            this.ciudad_filtro = [];
            this.ciudades.forEach((arrayItem:any)=> {
                if(arrayItem.city_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.ciudad_filtro.push(arrayItem)
                }
            });
        }


    }

    CerrarModal(){
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_estado = false;
            this.display_ciudad = false;
        }, 450)
        this.filtro = "";
    }
    
    FaseDos(){
        this.paso =2;
        this.initMap();
    }

    CloseModalCrear(){
        this.paso= 1;
        this.fase = 0;
    }

    PublicarNegocio(){
        
    }

    Vacio(obj:any){
        if(this.CreateMarketService.user_id){
            delete this.negocio.p1.usuario_nombre
            delete this.negocio.p1.usuario_email
        }
        return Vacio(obj);
    }
    VacioU(obj:any){
        return Vacio(obj);
    }

    SoloLetra(evt: any) {
        return SoloLetra(evt)
    }

    SoloNumero(evt: any) {
        return SoloNumero(evt)
    }

    Close(){
        this.paso= 1;
        this.fase = 0;
        this.Limpiar();
        this.CreateMarketService.user_id=null;
        this.Cerrar.emit(true)
    }

    pass(){
        if( (VacioU(this.negocio.p1.usuario_nombre) ||  VacioU(this.negocio.p1.usuario_email)) ||  !/^\w+([\.-]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail|admin)\.(?:|com|es)+$/.test(this.negocio.p1.usuario_email) ){
            return false;
        }else{
            return true;
        }
    }

    Limpiar(){
        this.formData=new FormData();
        this.intereses_name=[];
        this.user_imagen_show=[];
        this.user_imagen_load=[];
        this.user_imagen_new=[];
        this.urls_delete=[];
        this.show_negocio=null;
        this.negocio.p1.usuario_nombre=null;
        this.negocio.p1.usuario_email=null;   
    }

}
