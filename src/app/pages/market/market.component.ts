import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MarketService } from 'src/app/services/market/market.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';


declare var $: any;

@Component({
    selector: 'app-market',
    templateUrl: './market.component.html',
    styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit, AfterViewInit {

    constructor(
        private MarketService: MarketService,
        private GeoLocationService:GeoLocationService
    ) { }


    @ViewChildren("images", {read: ElementRef }) images: QueryList<ElementRef> | any;

    ngOnInit(): void {
        if(sessionStorage.getItem('guest')){
            this.guest=true;
            this.user = {pais:"Spain"}
            this.sel_ciudad = ""
            this.sel_estado = ""
            this.GeoLocationService.getStates(this.user.pais).then(res => {
                this.estados = res;
                this.loading = false;
            });
            
        }else{
            if(localStorage.getItem("usuario")){
                this.user = JSON.parse(localStorage.getItem("usuario") || '{}')
            }else{
                this.user = JSON.parse(sessionStorage.getItem("usuario") || '{}')
            }
            this.sel_ciudad = this.user.ciudad
            this.sel_estado = this.user.estado
            
            this.GeoLocationService.getStates(this.user.pais).then(res => {
                this.estados = res;
                this.loading = false;
            });
            this.GeoLocationService.getCities(this.sel_estado).then(res => {
                this.ciudades = res;
                this.loading = false;
            });
        }

        this.GetDestacados()
    }
    async ngAfterViewInit() {

        this.images.changes
        .subscribe(() => {
            let imagesArray = this.images.toArray();
        })

        $( () =>{

            $(document).on("click","#open_filtro",()=>{
                color_linea("","","");
            });

            $( document ).on("input","#line-km",()=>{
                // if($( "#rango-distancia-min" ).val() - $( "#rango-distancia-max" ).val() >= 0){
                //     $( "#rango-distancia-min" ).val($( "#rango-distancia-max" ).val()) 
                // }
                color_linea("","","");
                this.km = $("#line-km").val()

            });
            function color_linea(id_min:string, id_max:string, id_linea:string){
                let val1= ($("#line-km").val() /100) *100;
                $("#line-km").css('background', 'linear-gradient( to right, #FF3C76 0 '+val1+'% , #DFDFDF  0% '+(100-val1)+'%)');
                console.log(val1)
            }

        });
    }


    
    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    destacados:any;

    //?GESTION=================================================================================

    user:any=null;
    estados: any = [];
    ciudades: any = [];

    current:number= 0;
    last:number=0;
    data:any;
    urls_img:any;
    data_show:any=null;
    search:string="";
    latitude:any;
    longitude:any;
    sel_estado:any="";
    sel_ciudad:any="";
    //?CONTROL=================================================================================
    display_market: boolean = true ;
    display_res: boolean = false;
    display_show:boolean=false;
    display_filtro:boolean=false;
    show_distancia:boolean=false;
    dest:boolean=false;
    url = environment.server;
    point_img = 0;
    loading:boolean=false;
    guest:boolean=false;
    nombres_cat=[
        "MASAJES ERÓTICOS",
        "JUGUETES SEXUALES",
        "ESPACIOS SEXUALES",
        "AGENCIA MATRIMONIAL"
    ]
    nombre_cat:string=""
    new:boolean=false;
    filtro_fase:number=0;
    display_estado:boolean=false;
    display_ciudad:boolean=false;
    estado_filtro:any=[];
    ciudad_filtro:any=[];
    filtro:string="";
    km:number=100;
    // ! DATA ANUNCIO
    urls_image:any=[];
    index:any=null;
    max_index:any=null;
    //!FUNCIONES===========================================================================================================


    GetDestacados(){
        this.MarketService.Destacados().then(res=>{
            this.destacados=res
        })
    }

    //?GESTION=================================================================================
    CargarCiudad() {
        this.ciudades = null;
        this.sel_ciudad = null;
        this.loading = true;
        this.GeoLocationService.getCities(this.sel_estado).then(res => {
            this.ciudades = res;
            this.loading = false;
        });
    }

    SelectCat(id:number){
        this.loading = true;
        if(sessionStorage.getItem('guest')){
            this.MarketService.SearchNegocioInv(id).then(res=>{
                console.log(res)
                this.current = res.current_page;
                this.last = res.last_page;
                this.data = res.data;
                this.display_market=false;
                this.display_res=true;
                this.loading=false;
                this.nombre_cat = this.nombres_cat[id]
                this.loading = false;
            })
        }else{
            this.loading=true;
            this.MarketService.SearchNegocio(id).then(res=>{
                console.log(res)
                this.current = res.current_page;
                this.last = res.last_page;
                this.data = res.data;
                this.display_market=false;
                this.display_res=true;
                this.loading=false;
                this.nombre_cat = this.nombres_cat[id]
                this.loading = false;
            })
        }
    }
    
    OpenShow(data:any){
        this.data_show=data;
        if(this.display_market){
            this.dest=true;
            this.display_market= false;
        }else{
            this.dest=false;
            this.display_res= false;
        }
        this.display_show= true;
        this.urls_img = data.images.split(",");
        this.point_img = this.urls_img.length-1;
        console.log(data)
    }

    Search(){
        this.loading=true;
        if(this.search == ""){
            this.loading=false;
            return
        }
        this.MarketService.Search(this.search).then( (res:any)=>{
            this.data = res.data
            this.display_market=false;
            this.display_res=true;
            this.loading=false;
            console.log(res.data)
        })
    }

    Filtrar(){
        this.loading = true;
        let filtro={
            estado:this.sel_estado,
            ciudad:this.sel_ciudad,
            lat: this.latitude,
            lng: this.longitude,
            km: this.km
        }
        if(this.guest){
            this.MarketService.FitrarInv(filtro).then( (res:any)=>{
                // this.ref.detectChanges()
                this.data = res.data
                this.display_market=false;
                this.display_res=true;
                this.display_filtro =false
                this.loading=false;
                console.log(res.data)
    
            })
        }else{
            this.MarketService.Fitrar(filtro).then( (res:any)=>{
                // this.ref.detectChanges()
                this.data = res.data
                this.display_market=false;
                this.display_res=true;
                this.display_filtro =false
                this.loading=false;
                console.log(res.data)
            })
        }
        
        console.log(filtro)

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

    //?CONTROL=================================================================================
    SelectEstado(estado:string){
        this.sel_estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
    }

    SelectCiudad(ciudad:string){
        this.sel_ciudad = ciudad;
        this.CerrarModal();
    }

    CerrarModal(){
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

    GetImg(img:any){
        let urls_img = img.split(",");
        return urls_img[0]
    }

    CloseRes(){
        this.current = 0;
        this.last = 0;
        this.data = null;
        this.display_market= true;
        this.display_res=false;
    }

    CloseShow(){
        if(this.dest){
            this.display_market=true;
        }else{
            this.display_res= true;
        }

        this.display_show=false;
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
        }
        
    }

    async OpenFiltro(){
        this.display_filtro = true;
        navigator.geolocation.getCurrentPosition((position) => {
            this.latitude= position.coords.latitude;
            this.longitude= position.coords.longitude;
            console.log("asdsd", position.coords.latitude)
            this.show_distancia = true;
        })
        
    }

    CloseFiltro(){
        this.display_filtro =false
    }

    LimpiarFiltro(){
        this.km=100;
        this.sel_ciudad = this.user.ciudad
        this.sel_estado = this.user.estado
        this.PintarRango()
    }

    PintarRango(){

        setTimeout(()=>{

            let val1= ($("#line-km").val() /100) *100;
            $("#line-km").css('background', 'linear-gradient( to right, #FF3C76 0 '+val1+'% , #DFDFDF  0% '+(100-val1)+'%)');
            console.log(val1)
        }, 200)
       
    }

    LimpiarFiltroLocation(){
        this.sel_ciudad = null
        this.sel_estado = null
    }


}
