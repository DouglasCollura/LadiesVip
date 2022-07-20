import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NegociosService } from 'src/app/services/negocios/negocios.service';
import { environment } from 'src/environments/environment';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { Vacio, VacioU, SoloLetra, SoloNumero  } from '../../../../assets/script/general';
import { ConfigService } from 'src/app/services/config/config.service';
import { ControlService } from 'src/app/services/control/control.service';

declare var google:any;
declare var $: any;

@Component({
    selector: 'app-negocios',
    templateUrl: './negocios.component.html',
    styleUrls: ['./negocios.component.scss']
})
export class NegociosComponent implements OnInit, AfterViewInit {

    @ViewChild('map_canvas',{static:false}) mapElement: ElementRef | any;

    constructor(
        private GeoLocationService: GeoLocationService,
        private NegociosService:NegociosService,
        private ConfigService:ConfigService,
        private ControlService:ControlService
    ) { 
        
    }


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

        if(sessionStorage.getItem("usuario")){
            this.usuario = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
        }else{
            this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}' )
        }

        this.CargarNegocios();

        $(document).click((e:any)=>{
            if($(".table-options").css('display') == 'grid'){
                let container = $(".table-options");
                let containerBtn = $("#btnToggle");
                if (!container.is(e.target) && container.has(e.target).length === 0) { 
                    if ((!containerBtn.is(e.target) && containerBtn.has(e.target).length === 0)) { 
                        $(".table-options").css("display", "none")
                    }
                }
            }
        })
    }

    ngAfterViewInit(): void {
        console.log(this.mapElement)
    }

    lat=0;
    lng=0; 
    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    map: any;
    locaciones: any = null;
    estados: any = null;
    ciudades: any = null;
    negocios:any=[];

    usuario:any;
    //?GESTION=================================================================================
    negocio:any={
        p1:{
            nombre:null,
            categoria:null,
            telefono:null,
            pagina:null,
            descripcion:null
        },
        p2:{
            direccion:null,
            pais:'Spain',
            estado:null,
            ciudad:null,
            latitud:null,
            longitud:null
        }   

    }

    formData = new FormData();
    img_length=0;
    intereses_name:any=[];
    user_imagen_show:any=[];
    user_imagen_load:any=[];
    user_imagen_new:any=[];
    urls_delete:any=[];
    show_negocio:any;
    //?CONTROL=================================================================================
    url = environment.server;
    loading:boolean=false;
    loading_global:boolean=false;
    display_create:boolean=false;
    display_main:boolean=true;
    display_show:boolean=false;
    display_delete:boolean=false;
    fase:number = 0;
    ctrl_servicios: any = [];
    servicios_name:any="";
    id_delete=null;
    is_update=false;
    //? DISPLAY==========================================================
    display_interes:boolean=false;
    display_pais:boolean=false;
    display_estado:boolean=false;
    display_ciudad:boolean=false;
    //? FILTROS==========================================================
    filtro:string="";
    pais_filtro:any=[];
    estado_filtro:any=[];
    ciudad_filtro:any=[];


    //!FUNCIONES===========================================================================================================
    //?CARGA=================================================================================
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

    CargarNegocios(){
        this.loading = true;
        this.negocios = [];
        return this.NegociosService.GetNegocio().then(res=>{
            console.log(res)
            this.negocios = res;
            this.loading = false;
            this.loading_global=false;

            return true;
        });

    }

    //?GESTION=================================================================================
    
    filtrarSelect(id:any){
        var res = this.ctrl_servicios.filter( (res:any) => res == id);
        return res.length > 0 ? true:false;
    }

    selectServicio(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(".btn-genero-active").removeClass("btn-genero-active").addClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_servicios = [];
            this.ctrl_servicios.push(id);
            this.servicios_name = this.ControlService.servicios[id]
            console.log(this.ControlService.servicios[id])

        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_servicios.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
                
            });
            this.ctrl_servicios = [];
            this.servicios_name = ""

        }
        console.log(this.ctrl_servicios)
    }

    async initMap() {
        
        var longitude =null
        var latitude = null;
        
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

    SelectPais(pais:string){
        this.negocio.p2.pais = pais;
        this.CargarEstados();
        this.CerrarModal();
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

    CrearNegocio(){

        this.user_imagen_show.forEach((car: any, index: any, object: any) => {
            if(car.blob){
                this.img_length+=1;
                this.formData.append("imagen"+this.img_length, car.blob);
            }
        })
        this.formData.append("length", ""+this.img_length);
        this.formData.append("negocio",JSON.stringify(this.negocio))
        this.loading_global=true;
        this.NegociosService.CrearNegocio(this.formData).then(res=>{
            this.CargarNegocios().then(res=>{
                this.display_create = false;
                this.display_main = true;
            })
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
        this.loading_global=true;

        this.NegociosService.UpdateNegocio(this.show_negocio.id, this.formData).then(res=>{
            this.CargarNegocios().then(res=>{
                this.Limpiar();
                this.display_create = false;
                this.display_main = true;
            })
        });
    }

    DeleteNegocio(){
        this.loading_global = true;
        this.display_delete = false;
        this.NegociosService.DeleteNegocio(this.show_negocio.id).then(res=>{
            this.loading_global = false;
            this.CargarNegocios().then(res=>{
                this.display_show = false;
                this.display_main = true;
            })

        });
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
    
    //?CONTROL=================================================================================
    JoinCategoria(){
        if(this.ctrl_servicios.length ==0){
            this.negocio.p1.categoria = null;
        }else{
            this.negocio.p1.categoria = this.ctrl_servicios.join();
        }
        console.log("join")
        console.log(this.negocio.p1.categoria )
    }

    openMCreate(){
        this.display_create = true;
        this.display_main = false;
        this.fase = 1;
    }
    closeMCreate(){
         this.display_create = false;
        this.display_main = true;    
        this.fase = 0;
    }

    openMShow(negocio:any){
        this.show_negocio = negocio;
        this.display_main = false;
        this.display_show = true;
        console.log(negocio)
    }

    closeMShow(){
        this.show_negocio = null;
        this.display_main =true ;
        this.display_show = false;
    }

    OpenDelete(){
        $(".table-options").css("display", "none");
        this.display_delete = true
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
        this.servicios_name = this.ControlService.servicios[this.show_negocio.categoria]
        this.display_create=true;
        this.display_show=false;
        this.fase=1;
        this.user_imagen_load= this.show_negocio.images.split(',');
        this.user_imagen_show= this.show_negocio.images.split(',');
        this.is_update =true;
        this.initMap()
    }

    Vacio(obj:any){
        return Vacio(obj);
    }
    VacioU(obj:any){
        return VacioU(obj);
    }

    FaseDos(){
        this.fase =2;
        this.initMap();
    }

    CerrarModal(){
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_interes = false;
            this.display_pais = false;
            this.display_estado = false;
            this.display_ciudad = false;
        }, 450)
        this.filtro = "";
    }

    filtrar(){

        if(this.display_pais){
            this.pais_filtro = [];
            this.locaciones.forEach((arrayItem:any)=> {
                if(arrayItem.country_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.pais_filtro.push(arrayItem)
                }
            });
        }else if(this.display_estado){
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

    GetFirstPhoto(negocio:any){
        let urls_image = negocio.images.split(",");
        return urls_image[0]
    }

    SoloLetra(evt: any) {
        return SoloLetra(evt)
    }

    SoloNumero(evt: any) {
        return SoloNumero(evt)
    }

    showImage(urls: any) {
        return this.url + urls.split(",")[0];
    }

    ToggleOptionTable() {
        if ($(".table-options").css("display") == 'grid') {
            $(".table-options").css("display", "none");
        } else {
            $(".table-options").css("display", "grid");
        }
    }

    Close(){
        this.ConfigService.toggleConfig()
    }

    Limpiar(){
        this.negocio.p1.nombre=null;
        this.negocio.p1.categoria=null;
        this.negocio.p1.telefono=null;
        this.negocio.p1.pagina=null;
        this.negocio.p1.descripcion=null;
        this.negocio.p2.pais=null;
        this.negocio.p2.estado=null;
        this.negocio.p2.ciudad=null;
        this.negocio.p2.latitud=null;
        this.negocio.p2.longitud=null;
        this.servicios_name=[];
        this.formData= new FormData()
        this.img_length=0;
        this.urls_delete=[];
    }

}
