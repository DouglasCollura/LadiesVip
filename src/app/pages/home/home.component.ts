import { AfterViewInit, Component, ElementRef, OnInit, QueryList,  ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user/user.service';
import { FavoritoService } from 'src/app/services/favorito/favorito.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import {TranslateService} from '@ngx-translate/core';
import { ControlService } from 'src/app/services/control/control.service';

declare var $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

    constructor(
        private router: Router,
        private AuthServiceService: AuthServiceService,
        private AnunciosService: AnunciosService,
        private UserService:UserService,
        private FavoritoService:FavoritoService,
        private ConfigService:ConfigService,
        private GeoLocationService:GeoLocationService,
        private translate: TranslateService,
        private ControlService:ControlService

    ) {
        translate.setDefaultLang('es');
        if(localStorage.getItem('lang')){
            translate.use(localStorage.getItem('lang') || '');
        }else{
            translate.use('es')
        }

     }

    @ViewChildren("card", {read: ElementRef }) card: QueryList<ElementRef> | any;
    @ViewChildren("images", {read: ElementRef }) images: QueryList<ElementRef> | any;

    map: any;
    chosen:any = 0;
    marker: any;
    text:any;
    data:any;
    lat:any;
    lng:any;
    detected:any;
    changing:any = 0;
    polygons:any = [];
    quartier:any = 0;

    cont = 10;

    ngOnInit(): void {
        if(sessionStorage.getItem('guest')){
            this.guest=true;
            this.new=true;
            this.user = {pais:'Spain'}
            this.ctrl_intereses = [0,1,2,3,4,5,6,7,8]
            this.GeoLocationService.getStates(this.user.pais).then(res => {
                this.estados = res;
                this.loading = false;
            });
            
            this.AnunciosService.GetAnunciosInv().then(res=>{
                this.anuncios.data = res.data;
                this.anuncio = res.data[0];
                setTimeout(()=>{
                    let imagesArray = this.card.toArray();
                    imagesArray[imagesArray.length-1].nativeElement.style.display = 'grid'
                },500)

                this.AnunciosService.GetCarruselInv().then(res=>{
                    this.carrusel = res;
                }).catch(error=>{
                    localStorage.clear();
                    sessionStorage.clear();
                    location.href='/'
                })

            })

        }
        else{

            this.UserService.GetNotifys().then( (res:any)=>{
                this.UserService.notifys = res;
                let fil =res.filter( (res:any)=>{return res.tipo == 4} )
                if(fil.length >0){
                    sessionStorage.setItem('free','1')
                }else{
                    sessionStorage.removeItem('free')
                }
            })
            
            if(localStorage.getItem('new')){
                this.new=true;
                localStorage.removeItem('new')
            }

            this.GetAnuncios();
            this.premium=this.UserService.getPremium();
    
            this.UserService.ValidatePremium().then(res=>{
                
                if(res[0]){
                    this.UserService.setPremium(true);
                    this.premium = true;
                    if(localStorage.getItem('max_ads')){
                        localStorage.removeItem('max_ads')
                    }
                }else{
                    if(localStorage.getItem('max_ads')){
                        this.max_ads = parseInt(localStorage.getItem('max_ads') || '{}')
                    }else{
                        localStorage.setItem('max_ads', '15')
                        this.max_ads = 15;
                    }

                    this.UserService.ValMaxAds().then(res=>{
                        if(res== 1){
                            this.max_ads = 0;
                            this.user.max_anuncios =1;
                            if(localStorage.getItem('usuario')){
                                localStorage.setItem('usuario', JSON.stringify(this.user));
                            }else{
                                sessionStorage.setItem('usuario', JSON.stringify(this.user));
                            }
                        }else{
                            this.user.max_anuncios =0;
                            if(localStorage.getItem('usuario')){
                                localStorage.setItem('usuario', JSON.stringify(this.user));
                            }else{
                                sessionStorage.setItem('usuario', JSON.stringify(this.user));
                            }
                        }
                    })
                }
            })
            .catch(error=>{
                localStorage.clear();
                sessionStorage.clear();
                location.href='/'
            })

                if(localStorage.getItem("usuario")){
                    this.user = JSON.parse(localStorage.getItem("usuario") || '{}')
                }else{
                    this.user = JSON.parse(sessionStorage.getItem("usuario") || '{}')
                }
                this.ctrl_intereses = this.user.interes_identidad.split(",");
                // this.sel_ciudad = this.user.ciudad
                // this.sel_estado = this.user.estado
                
                this.GeoLocationService.getStates(this.user.pais).then(res => {
                    this.estados = res;
                    this.loading = false;
                });
                // this.GeoLocationService.getCities(this.sel_estado).then(res => {
                //     this.ciudades = res;
                //     this.loading = false;
                // });

            this.AnunciosService.GetMyAdd().then(res=>{
                if(localStorage.getItem('myadd')){
                    localStorage.removeItem('myadd')
                }
                if(res[0]){
                    localStorage.setItem('myadd',JSON.stringify(res[0]) )
                }
            })
            .catch(error=>{
                localStorage.clear();
                sessionStorage.clear();
                location.href='/'
            })

            this.UserService.ValidatePack().then( (res:any)=>{
    
                if(localStorage.getItem('pack')){
                    localStorage.removeItem('pack')
                }
                if(res.length == 0){
                }else{
                    localStorage.setItem('pack',JSON.stringify(res[0]) )
                }
                
            })
            .catch(error=>{
                localStorage.clear();
                sessionStorage.clear();
                location.href='/'
            })
    
            this.AnunciosService.GetCarrusel().then(res=>{
                this.carrusel = res;
            })
            .catch(error=>{
                localStorage.clear();
                sessionStorage.clear();
                location.href='/'
            })
        }

    }
    async ngAfterViewInit() {
        this.AnunciosService.add_select.subscribe(res=>{
            if(res){
            }
            $(this.add_select[0]).remove()
            this.card.forEach((car: any, index: any, object: any)=> {
                
                if (car.nativeElement.id == this.add_select[0].id) {
                    object.splice(index, 1);
                }
            });
        })

        // this.card.changes
        // .subscribe(() => {
        //     let cardArray = this.card.toArray();

        //     this.cards_length = cardArray.length;
        //     this.cards_arrays=[];
        //     this.cards_arrays=cardArray;
        //     this.index_card = cardArray.length-1;
        //     // if(cardArray[this.index_card-1]){
        //     //     cardArray[this.index_card-1].nativeElement.style.display = 'grid';
        //     // }
        //     if(cardArray[this.index_card] == 0){
        //         cardArray[this.index_card].nativeElement.style.display = 'grid';
        //     }
        //     // else{
        //     //     if(cardArray.length > 0){
        //     //         cardArray[this.index_card+1].nativeElement.style.display = 'grid';
        //     //     }
        //     // }
        // })

        $( document ).on("input","#rango-distancia-min",()=>{
            if($( "#rango-distancia-min" ).val() - $( "#rango-distancia-max" ).val() >= 0){
                $( "#rango-distancia-min" ).val($( "#rango-distancia-max" ).val()) 
                this.edad_min = $( "#rango-distancia-min" ).val()
            }
        });

        $( document ).on("input","#rango-distancia-max",()=>{
            if($( "#rango-distancia-max" ).val() - $( "#rango-distancia-min" ).val() <= 0){
                $( "#rango-distancia-max" ).val($( "#rango-distancia-min" ).val()) 
                this.edad_max = $( "#rango-distancia-max" ).val()
            }
        })

    }   
    

    //!DATA=====================================================================
    latitude: number=0;
    longitude: number=0;
    zoom: number=0;
    address: string="";
    private geoCoder:any;
    //?CARGA===================================================================================
    anuncios: any = {
        data: [],
        length: null,
        index: ""
    };

    carrusel:any;


    //?GESTION===================================================================================
    anuncio: any = [];
    user:any=null;
    estados: any = [];
    ciudades: any = [];
    display_filtro:boolean=false;
    show_distancia:boolean=false;
    ctrl_intereses: any = [];
    sel_estado:any="";
    sel_ciudad:any="";
    edad_min:number=18;
    edad_max:number=60;
    intereses_name:any=[];
    //?CONTROL===================================================================================
    loggedIn: boolean = false;
    hoy = new Date();
    load: boolean = false;
    add_select:any;
    show_anuncio:any=null;
    estado_filtro:any=[];
    ciudad_filtro:any=[];
    // * MODALES ================================
    ctrl_modal_detalles:boolean=false;
    ctrl_menu:number=1;
    server = environment.server;
    premium:boolean=false;
    alert:number=0;
    loading:boolean=false;
    display_estado:boolean=false;
    display_ciudad:boolean=false;

    // ! DATA ANUNCIO
    urls_image:any=[];
    urls_show:any=[];
    urls_video:any=[];
    urls_thumbs:any=[]
    show_play:boolean=false;
    point_img = 0;
    url = environment.server;
    index:any=null;
    max_index:any=null;
    guest:boolean=false;
    alert_guest:boolean=false;
    new:boolean=false;
    cards_length:any;
    index_card:any; 
    cards_arrays:any;
    km:number = 100;
    filtro:string="";
    display_video:boolean=false;
    filtro_fase:number=0;
    alert_max:boolean=false;
    max_ads:number=0;
    display_planes:boolean=false;
    max_fav:boolean=false;
    //!FUNCIONES=============================================================
    //?CARGA=============================================================
    GetAnuncios() {

        this.AnunciosService.GetAnuncios(this.anuncios.index).then(res => {
            if(this.anuncios.index == ''){
                // this.anuncios.data = res.data;
                this.anuncios.length = res.total;
                this.anuncio = this.anuncios.data[0]
                this.anuncios.data = res.data
                // res.data.reverse().forEach((car: any, index: any, object: any)=> {
                //     car.active=false;
                //     this.anuncios.data.push(car);
                // });
                setTimeout(()=>{
                    let imagesArray = this.card.toArray();
                    imagesArray[imagesArray.length-1].nativeElement.style.display = 'grid'
                },500)
            }else{
                res.data.forEach((car: any, index: any, object: any)=> {
                    this.anuncios.data.push(car);
                });
            }
            
            if(res.next_page_url != null){
                this.anuncios.index = res.next_page_url.split('page=')[1]
            }else{
                this.anuncios.index="";
            }
        });
    }

    CargarCiudad() {
        this.ciudades = null;
        this.sel_ciudad = null;
        this.loading = true;
        this.GeoLocationService.getCities(this.sel_estado).then(res => {
            this.ciudades = res;
            this.loading = false;
        });
    }

    //?GESTION============================================================

    showImage(urls: any, tipo:number) {
        let dato = ''
        if(tipo === 1){
             dato = this.server + '/storage//' + urls;
        }
        if(tipo === 2){
             dato = this.server + '/storage//' + urls;
        }
        return dato
    }

    showImageS(images:any){
        let dato = '';
        if(images.type === 1){
            dato = this.server + '/storage//' + images.media;
        }
        if(images.type === 2){
            dato = this.server + '/storage/thumnails/' + images.thumnails;
        }
        return dato;
    }

    signOut(): void {
        this.AuthServiceService.logOut()
            .then(() => {
                sessionStorage.clear()
                this.router.navigate(['/'])
            })
    }

    cardCheck(id:any){

        if(localStorage.getItem('max_ads') && !this.guest){

            if(this.max_ads >0){
                this.max_ads -=1;
                localStorage.setItem('max_ads', this.max_ads.toString())
                $("#"+id).addClass("card_check")
                
                let imagesArray = this.card.toArray();
                if(imagesArray[imagesArray.length-2]){
                    $(imagesArray[imagesArray.length-2].nativeElement).css('display','grid')
                }
                setTimeout(()=>{
                    $("#"+id).remove()
                    this.anuncios.data.splice(0,1)
                    $(imagesArray[imagesArray.length-1].nativeElement).remove()
                    if(this.anuncios.data.length <5 && this.anuncios.index != ''){
                        this.GetAnuncios();
                    }
                    
                },420)
            }else{
                this.alert_max =true;

                if(this.user.max_anuncios ==0 || this.user.max_anuncios == null){
                    this.UserService.MaxAds().then(()=>{
                        this.user.max_anuncios = 1;
                    })
                }
            }

        }
        else if(sessionStorage.getItem('max_ads')){
            if(this.max_ads >0){
                this.max_ads -=1;
                sessionStorage.setItem('max_ads', this.max_ads.toString())
                $("#"+id).addClass("card_check")

                let imagesArray = this.card.toArray();
                if(imagesArray[imagesArray.length-2]){
                    $(imagesArray[imagesArray.length-2].nativeElement).css('display','grid')
                }
                setTimeout(()=>{
                    $("#"+id).remove()
                    this.anuncios.data.splice(0,1)
                    $(imagesArray[imagesArray.length-1].nativeElement).remove()
                    if(this.anuncios.data.length <5 && this.anuncios.index != ''){
                        this.GetAnuncios();
                    }
                    
                },420)
            }else{
                this.alert_max =true;
            }
        }
        else{
            $("#"+id).addClass("card_check")
            let imagesArray = this.card.toArray();
            if(imagesArray[imagesArray.length-2]){
                $(imagesArray[imagesArray.length-2].nativeElement).css('display','grid')
            }
            setTimeout(()=>{
                $("#"+id).remove()
                this.anuncios.data.splice(0,1)
                $(imagesArray[imagesArray.length-1].nativeElement).remove()
                if(this.anuncios.data.length <5 && this.anuncios.index != ''){
                    this.GetAnuncios();
                }
                
            },420)
    
        }
        
    }

    cardDiss(id:any,anuncio:any){

        if(localStorage.getItem('max_ads')){

            if(this.max_ads >0){
                this.max_ads -=1;
                localStorage.setItem('max_ads', this.max_ads.toString())
                $("#"+id).addClass("card_diss")
            
                let imagesArray = this.card.toArray();
                if(imagesArray[imagesArray.length-2]){
                    $(imagesArray[imagesArray.length-2].nativeElement).css('display','grid')
                }
                setTimeout(()=>{
                    $("#"+id).remove()
                    this.anuncios.data.splice(0,1)
                    $(imagesArray[imagesArray.length-1].nativeElement).remove()
                    if(this.anuncios.data.length <5 && this.anuncios.index != ''){
                        this.GetAnuncios();
                    }
                    
                },420)
    
                if(!this.guest){
                    this.AnunciosService.RechazarAnuncio(anuncio.id)
                }
            }else{
                this.alert_max =true;
                if(this.user.max_anuncios ==0 || this.user.max_anuncios == null){
                    this.UserService.MaxAds().then(()=>{
                        this.user.max_anuncios = 1;
                    })
                }
            }

        }else{
            $("#"+id).addClass("card_diss")

            let imagesArray = this.card.toArray();
            if(imagesArray[imagesArray.length-2]){
                $(imagesArray[imagesArray.length-2].nativeElement).css('display','grid')
            }
            setTimeout(()=>{
                $("#"+id).remove()
                this.anuncios.data.splice(0,1)
                $(imagesArray[imagesArray.length-1].nativeElement).remove()
                if(this.anuncios.data.length <5 && this.anuncios.index != ''){
                    this.GetAnuncios();
                }
                
            },420)
            if(!this.guest){
                if(this.anuncios.data.length <5 && this.anuncios.index != ''){
                    this.GetAnuncios();
                }
            }

            if(this.premium){
                
                this.AnunciosService.RechazarAnuncio(anuncio.id).then(res=>{
                })
            }
        }
    }

    cardFav(id:any,anuncio:any){
        if( this.guest){
            this.alert_guest=true;
            $( "#home" ).trigger( "click" );
        }else{

            if(localStorage.getItem('max_ads')){

                if(this.max_ads >0){
                    this.max_ads -=1;
                    localStorage.setItem('max_ads', this.max_ads.toString())
                    
                    $("#"+id).addClass("card_fav")
    
                    let imagesArray = this.card.toArray();
                    if(imagesArray[imagesArray.length-2]){
                        $(imagesArray[imagesArray.length-2].nativeElement).css('display','grid')
                    }
                    setTimeout(()=>{
                        $("#"+id).remove()
                        this.anuncios.data.splice(0,1)
                        $(imagesArray[imagesArray.length-1].nativeElement).remove()
                        if(this.anuncios.data.length <5 && this.anuncios.index != ''){
                            this.GetAnuncios();
                        }
                        
                    },420)
                    this.FavoritoService.AddFavorite(anuncio.id).catch(res=>{
                        this.max_fav=true;
                    })
                }else{
                    this.alert_max =true;
                    if(this.user.max_anuncios ==0 || this.user.max_anuncios == null){
                        this.UserService.MaxAds().then(()=>{
                            this.user.max_anuncios = 1;
                        })
                    }
                }
    
            }else{
                $("#"+id).addClass("card_fav")

                let imagesArray = this.card.toArray();
                if(imagesArray[imagesArray.length-2]){
                    $(imagesArray[imagesArray.length-2].nativeElement).css('display','grid')
                }
                setTimeout(()=>{
                    $("#"+id).remove()
                    this.anuncios.data.splice(0,1)
                    $(imagesArray[imagesArray.length-1].nativeElement).remove()
                    if(this.anuncios.data.length <5 && this.anuncios.index != ''){
                        this.GetAnuncios();
                    }
                    
                },420)
                this.FavoritoService.AddFavorite(anuncio.id).then(res=>{
                }).catch(res=>{
                    this.max_fav=true;
                })
            }
        }

    }

    //?CONTROL==============================================================================
    OpenAnuncio(anuncio:any, id:any){
        this.add_select = $("#"+id);
        this.show_anuncio =anuncio;
        this.ctrl_modal_detalles = true
        this.urls_image = anuncio.images?.slice().reverse();
        let intereses = this.show_anuncio.intereses.split(",");
        this.intereses_name=[];
        for (const interes in intereses) {
            this.translate.get('identidad.upt_'+interes).subscribe((res: any) => {
                this.intereses_name.push(this.translate.instant(res))
            })
            // this.intereses_name.push(this.ControlService.generos[parseInt(interes)])
        }
        this.intereses_name = this.intereses_name.join(', ')
        
        // if(this.show_anuncio.url_video != null){
        //     if(this.show_anuncio.url_video.split(",")[0] != ''){
        //         this.urls_video = this.show_anuncio.url_video.split(",");
        //         this.urls_thumbs = this.show_anuncio.thumbnails.split(',')
        //     }
        // }

        this.urls_image.forEach(async(car: any, index: any, object: any) => {
            console.log(car)
            if(car.type === 1){
                this.urls_show.push({type:1, val:car})
            }
            if(car.type === 2){
                this.urls_show.push({type:2, val:car})
                this.urls_video.push(car.media);
            }
        })

        // this.urls_thumbs.forEach(async(car: any, index: any, object: any) => {
        //     this.urls_show.push({type:2, val:car})
        // })
        // this.AnunciosService.anuncio = anuncio;
        // this.router.navigate(['home/anuncio'])
    }

    async OpenFiltro(){
        this.display_filtro = true;
        navigator.geolocation.getCurrentPosition((position) => {
            this.latitude= position.coords.latitude;
            this.longitude= position.coords.longitude;
            this.show_distancia = true;
        })
        this.PintarRango()
    }

    SelectEstado(estado:string){
        this.sel_estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
    }

    SelectCiudad(ciudad:string){
        this.sel_ciudad = ciudad;
        this.CerrarModal();
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

    GetEdad(fecha: any) {
        var cumpleanos = new Date(fecha);
        var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
        var m = this.hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    }
    
    nav(menu:number) {
        this.ctrl_menu = menu;
        this.display_planes=false;
    }

    MoveLeft(){
        let imagesArray = this.images.toArray();

        if(this.index == null){
            this.index = imagesArray.length-1
            this.max_index = imagesArray.length-1
        }

        if(this.index < this.max_index){
            imagesArray[this.index+1].nativeElement.style.display = 'grid'
            this.index= this.index+1;
            this.point_img = this.point_img-1;
            if(this.urls_show.slice()[this.index].type == 2){
                this.show_play = true;
            }else{
                this.show_play = false;
            }

        }
    }

    MoveRight(){
        let imagesArray = this.images.toArray();

        if(this.index == null){
            this.index = imagesArray.length-1
            this.max_index = imagesArray.length-1
        }

        if(this.index > 0){
            imagesArray[this.index].nativeElement.style.display = 'none'
            this.index= this.index-1;
            this.point_img = this.point_img+1;
            if(this.urls_show.slice()[this.index].type == 2){
                this.show_play = true;
            }else{
                this.show_play = false;
            }

        }
        
    }

    CerrarModal(){
        this.ctrl_modal_detalles = false;
        this.point_img = 0;
        this.index=null;
        this.max_index=null;
        this.urls_image=[];
        this.urls_show =[];
        this.urls_thumbs=[];
        this.urls_video=[];
        this.show_play=false;
        $(".filtros").removeClass("fadeIn")
        $(".filtros").addClass("fadeOut")
        $(".filtros").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_estado = false;
            this.display_ciudad = false;
        }, 450);
        this.filtro = "";
    }

    OpenAnuncioPopular(anuncio:any){
        
        if(this.guest){
            this.alert_guest=true;
        }
        else if(this.premium){
            this.OpenAnuncio(anuncio,'null')
        }else{
            this.alert=1;
        }
    }

    Filtrar(){
        let filtro={
            estado:this.sel_estado,
            ciudad:this.sel_ciudad,
            intereses:this.ctrl_intereses.join(),
            edad_min: this.edad_min,
            edad_max: this.edad_max,
            lat: this.latitude,
            lng: this.longitude,
            km: this.km
        }
        this.loading=true;

        if(sessionStorage.getItem('guest')){
            this.AnunciosService.FitrarInv(filtro).then( (res:any)=>{
                this.anuncios.data = res.data
                this.loading=false;
                this.display_filtro = false;   
                setTimeout(()=>{
                    let imagesArray = this.card.toArray();
                    imagesArray[imagesArray.length-1].nativeElement.style.display = 'grid'
                },500) 
            })
            
        }else{
            this.AnunciosService.Fitrar(filtro).then( (res:any)=>{
                this.anuncios.data = res.data
                this.loading=false;
                this.display_filtro = false;
                setTimeout(()=>{
                    let imagesArray = this.card.toArray();
                    imagesArray[imagesArray.length-1].nativeElement.style.display = 'grid'
                },500)
    
            })
        }


    }

    GoPlanes(){
        this.alert = 0;
        this.ctrl_menu = 4;
    }

    GoLanding(){
        location.href='../'
    }

    CloseNew(){
        this.new=false;
    }

    CloseFiltro(){
        this.display_filtro =false
    }

    ReturnFiltro(){
        // this.sel_ciudad=this.user.ciudad
        // this.sel_estado=this.user.estado
        this.filtro_fase = 0;
    }

    LimpiarFiltro(){
        this.edad_min=18;
        this.edad_max=60;
        this.km=100;
        if(this.guest){
            this.ctrl_intereses = [0,1,2,3,4,5,6,7,8]
        }else{
            this.ctrl_intereses = this.user.interes_identidad.split(",");
        }
        this.sel_ciudad = null
        this.sel_estado = null
        this.PintarRango()
    }

    PintarRango(){
        setTimeout(()=>{
            let val1=  ( (this.edad_min-18) /(60-18)) *100;
            let val2=( (this.edad_max -18) / (60-18)) *100;
            
            let valk= ($("#line-km").val() /100) *100;
            $("#line-km").css('background', 'linear-gradient( to right, #FF3C76 0 '+valk+'% , #DFDFDF  0% '+(100-valk)+'%)');
            $("#line-distancia").css('background', 'linear-gradient( to right, #DFDFDF '+(val1)+'%'+', #FF3C76 '+(val1)+'%'+', #FF3C76 '+val2+'%'+', #DFDFDF '+val2+'%'+')');
        },100)
    }

    LimpiarFiltroLocation(){
        this.sel_ciudad = null
        this.sel_estado = null
    }


    filtrarSelect(id:any){

        var res;

        res = this.ctrl_intereses.filter( (res:any) => res == id);

        return res.length > 0 ? true:false;
    }

    selectIdentidad(id: number, event: any) {
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            
                this.ctrl_intereses.push(id);
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");

            this.ctrl_intereses.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
            });
        }
    }

    getCantidad(type:boolean, anuncio:any){
        if(type){
            return anuncio.filter((x:any)=> x.type !== 2).length;
            
        }else{
            return anuncio.filter((x:any)=> x.type !== 1).length;
        }
    }

    // !======================VIDEO================================================

    PlayVideo(){

        if(this.guest){
            this.alert_guest = true;
        }else{
            if(this.premium){
                this.AnunciosService.index_vid = this.urls_video.slice()[this.index];
                this.display_video=true;
            }else{
                this.alert = 2;
            }
        }
    }

    OpenPlanes(){
        this.display_planes = true;
        this.alert=0;
        this.alert_max = false;
        this.CerrarModal();
    }

    closedVideo(){
        this.display_video = false;
        $('.btn-play').css('display','block')
        $('.btn-play').removeClass('fadeOut').addClass('fadeIn')

    }
}
