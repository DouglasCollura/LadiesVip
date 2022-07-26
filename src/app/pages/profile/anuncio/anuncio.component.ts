import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { ControlService } from 'src/app/services/control/control.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { UserService } from 'src/app/services/user/user.service';
import {TranslateService} from '@ngx-translate/core';

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
        private ConfigService:ConfigService,
        private UserService:UserService,
        private translate: TranslateService 

    ) { }

    ngOnInit(): void {
        

        if(sessionStorage.getItem("usuario")){
            this.datos = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
        }else{
            this.datos = JSON.parse(localStorage.getItem("usuario") || '{}' )
        }
        this.mypack = JSON.parse(localStorage.getItem("pack") || '{}')
        
        if(this.mypack.pack == 1 || this.mypack.pack == 0){
            this.myboost = "boost-standar.png"
            this.mycolor = "#567BFF"
        }
        if(this.mypack.pack == 2){
            this.myboost = "boost-plus.png"
            this.mycolor = "#EBA046"
        }
        if(this.mypack.pack == 3){
            this.myboost = "boost-extra.png"
            this.mycolor = "#29C56D"
        }
        if(this.mypack.pack == 4){
            this.myboost = "boost-carrusel.png"
            this.mycolor = "#567BFF"
        }

        if(this.AnunciosService.anuncio){
            this.PrepararAnuncio(this.AnunciosService.anuncio)
        }else{
            this.isFirstAdd = true;
            this.myboost = "Boost.png"

        }
    }


    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    datos:any;
    urls_image=[];
    urls_video=[];
    urls_thumbs=[];
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
    video_length=0;
    intereses_name:any=[];
    user_imagen_show:any=[];
    user_videos_show:any=[];

    urls_delete:any=[];
    urls_videos_delete:any=[];    
    
    //?CONTROL=================================================================================
    menu:boolean=false;
    display_interes:boolean=false;
    ctrl_intereses: any = [];
    url = environment.server;
    display_main:boolean=true;
    isFirstAdd:boolean=true;
    isFirstBoost:boolean=true;
    hoy = new Date();
    loading:boolean=false;
    done:boolean=false;
    update:boolean=false;
    fase_update=0;
    mypack:any=null;
    myboost:any=null;
    mycolor:any=null;
    reno:boolean=false;
    display_packs:boolean=false;
    thumbnail:any=[];

    //!FUNCIONES===========================================================================================================


    //?GESTION=================================================================================

    selectIdentidad(id: number, event: any) {
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
        reader.readAsDataURL(event.target.files[0]);
        let file = event.target.files[0];

        reader.onload = (e: any) => {
            this.user_imagen_show.push({img:e.target.result, id:this.img_length+1,blob:file});
        }
        this.img_length = this.img_length+1;
        
    }
 

    CrearAnuncio(){
        this.anuncio.intereses = this.ctrl_intereses.join();
        this.loading=true;
        this.img_length = 0;

        this.user_imagen_show.forEach((car: any, index: any, object: any) => {
            if(car.blob){
                this.img_length+=1;
                this.formData.append("imagen"+this.img_length, car.blob);
            }
        })

        this.video_length = 0;
        this.user_videos_show.forEach(async(car: any, index: any, object: any) => {
            if(car.blob){
                this.video_length+=1;
                this.formData.append("thumbnail"+this.video_length, this.dataURLtoFile(this.thumbnail[this.video_length-1],'img.jpg '));
                this.formData.append("video"+this.video_length, car.blob);
            }
        })

        this.formData.append("video_length", ""+this.video_length);
        this.formData.append("length", ""+this.img_length);
        this.formData.append("anuncio",JSON.stringify(this.anuncio))
        this.loading= true;

        this.AnunciosService.CrearAnuncio(this.formData).then(()=>{
            this.loading= false;
            this.done = true;

            setTimeout( ()=>{
                location.reload()
            },3000 )

        })
    }

    async UpdateAnuncio(){
        this.fase_update = 1;
        this.img_length = 0;
        this.anuncio.intereses = this.ctrl_intereses.join();
        this.user_imagen_show.forEach((car: any, index: any, object: any) => {
            if(car.blob){
                this.img_length+=1;
                this.formData.append("imagen"+this.img_length, car.blob);
            }
        })

        this.video_length = 0;
        this.user_videos_show.forEach((car: any, index: any, object: any) => {
            if(car.blob){
                this.video_length+=1;
                this.formData.append("thumbnail"+this.video_length, this.dataURLtoFile(this.thumbnail[this.video_length-1],'img.jpg '));
                this.formData.append("video"+this.video_length, car.blob);
            }
        })

        this.formData.append("video_length", ""+this.video_length);
        this.formData.append("length", ""+this.img_length);
        this.formData.append("anuncio",JSON.stringify(this.anuncio))
        this.formData.append("img_delete",JSON.stringify(this.urls_delete))
        this.formData.append("video_delete",JSON.stringify(this.urls_videos_delete))

        await this.AnunciosService.UpdateAnuncio(this.formData,this.id)
        .then((res)=>{

            if(res.error){
            }else{
                this.UserService.ValidatePack().then( (res:any)=>{
                    localStorage.removeItem('pack')

                    if(res.anuncios){
                        localStorage.setItem('pack',JSON.stringify(res) )
                    }

                    this.fase_update = 2;
                    
                    setTimeout(()=>{
                        this.fase_update = 0;
                        this.update=false;
                        location.reload()

                    }, 1000)
                });

            }
        })
        .catch((error)=>{
            this.fase_update = 0;
            this.update=false;
        })
    }

    PrepararAnuncio(anuncio:any){
        this.isFirstAdd = false;
        this.anuncio.hab_notificacion = anuncio.hab_notificacion;
        this.anuncio.hab_chat = anuncio.hab_chat;
        this.anuncio.hab_wts = anuncio.hab_wts;
        this.anuncio.descripcion = anuncio.descripcion;
        this.urls_image = anuncio.urls.split(",");
        if(anuncio.url_video != null){
            if(anuncio.url_video.split(",")[0] != ''){
                this.urls_video = anuncio.url_video.split(",");
                this.urls_thumbs = anuncio.thumbnails.split(',')
                this.video_length +=this.urls_video.length;
            }
        }
        this.id = anuncio.id;
        this.ctrl_intereses = anuncio.intereses.split(",");
        
        for (const interes in this.ctrl_intereses) {
            this.translate.get('identidad.upt_'+interes).subscribe((res: any) => {
                this.intereses_name.push(this.translate.instant(res))
            })
            // this.intereses_name.push(this.ControlService.generos[parseInt(interes)])
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
                }
            });
        }

    }

    GetEdad(fecha:any){
        var cumpleanos = new Date(fecha);
            var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
            var m = this.hoy.getMonth() - cumpleanos.getMonth();

            if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
                edad--;
            }
            return edad;
    }

    //?CONTROL=================================================================================

    check(event:any){
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
    }

    Done(){
        this.done = false;
        location.reload()

    }

    Close(){
        this.ConfigService.toggleProfile()
    }

    checkUpdate(){
        if(this.mypack.boosts == 0){
            this.reno = true;
        }else{
            this.update=true;
        }
    }

    closeUpdate(){
        this.update=false;
    }

    DisplayPack(){
        if(this.display_packs){
            this.display_packs = false;
            this.display_main=true

        }else{
            this.display_packs = true;
            this.display_main=false
        }
    }


    // !=========VIDEO========================================================================

    DeleteVid(video:any,tipo:number){
        if(tipo == 1){
            this.urls_video.forEach((car: any, index: any, object: any) => {
                if (car == video) {
                    this.urls_videos_delete.push(video);
                    this.urls_thumbs.splice(index,1)
                    object.splice(index, 1);
                    this.video_length -=1;
                    $('#video_here')[0].src=""; 
                }
            });
        }else{
            this.user_videos_show.forEach((car: any, index: any, object: any) => {
                
                if (car == video) {
                    object.splice(index, 1);
                    this.thumbnail.splice(index, 1)
                    $('#video_here')[0].src=''
                    this.video_length -=1;
                }
                

            });
        }
    }


    Video(ev:any){
    }
    
    UploadVideo(control:any) {
        var video:any = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = ()=> {
            window.URL.revokeObjectURL(video.src);
            let arr:any = video.duration.toString().split('.')
            if(arr[0] >80 || arr.length > 2){
                alert("El video es muy largo");

            }else{
                this.user_videos_show.push({blob:control.target.files[0]})
                this.video_length +=1;
                control.target.value = ''; 
                this.loading=true;
                this.GenerateThumb()
            }
        }
        video.src = URL.createObjectURL(control.target.files[0]);
        // var fileUrl = window.URL.createObjectURL(fileInput.files[0]);
        // $source.parent()[0].load();
        // if(control.target.files[0].size > 2097152){
        //     alert("File is too big!");
        //  };
    }

    PlayVideo(index:number,type:number){
        var $source = $('#video_here');
        $('.content-slots > .active').removeClass('active')

        if(type == 1){
            $('#cardPlay'+index).addClass('active')
            $source[0].src = URL.createObjectURL(this.user_videos_show[index].blob);
            $(".video").attr("src", $source);
        }else{
            $('#cardPlayShow'+index).addClass('active')
            $source[0].src =this.url+this.urls_video[index];
            $(".video").attr("src", $source);
        }

    }

    ClickVideoInput(){
        $('.input-video').trigger('click')
    }


    Play(){
       $('#video_here')[0].paused
        if($('#video_here')[0].paused){
           $('#video_here')[0].play()
            $('.bg-control').addClass('fadeOut')
            $('.btn-play').addClass('fadeOut')
            setTimeout(()=>{
                $('.bg-control').css('display','none')
                $('.btn-play').css('display','none')
            },400)
            
        }else{
            $('#video_here')[0].pause()
            $('.bg-control').removeClass('fadeOut').addClass('fadeIn')
            $('.btn-play').removeClass('fadeOut').addClass('fadeIn')
            $('.bg-control').css('display','grid')
            $('.btn-play').css('display','block')
        }
        $('#video_here')[0].paused

        // console.log($('#video_here')[0])
        // $('#video_here').play()
    }

    ProgressBar(){
        let progres = ($('#video_here')[0].currentTime /$('#video_here')[0].duration)*100 
        $(".progress-bar").css('background', 'linear-gradient( to right, #FF3C76 0 '+progres+'% , #DFDFDF  0% '+(100-progres)+'%)');
    }

    Muted(){
        if($('#video_here')[0].muted){
            $('#video_here')[0].muted =false
            $(".btn-volume").find('img')[0].src='../../../../assets/imagenes/volume.svg'
        }else{
            $('#video_here')[0].muted =true
            $(".btn-volume").find('img')[0].src='../../../../assets/imagenes/muted.svg'

        }
    }

    GenerateThumb(){
        // var video = $('#video_here_u')[0];
        $('.content-video').prepend("<video id='vid_temp'></video>");
        var video:any = $('#vid_temp')[0];
        // video.style.display='grid'
        video.onloadedmetadata=(()=>{
            if (video.objectURL){
                URL.revokeObjectURL(video.src);
            }
            video.objectURL=false;
            var preview=document.createElement("canvas");
            preview.setAttribute("width",video.videoWidth);
            preview.setAttribute("height",video.videoHeight);
            var ctx:any=preview.getContext('2d');      
            video.play();
            video.muted=true;
            setTimeout(()=>{
            video.pause();

                // video.currentPostion=2000;
                ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight);
                // cargar en una imagen HTML
                var dataURL = preview.toDataURL();
                this.thumbnail.push(dataURL);
                // this.loading=false;
                $('#vid_temp').remove()
                this.loading=false; 
            },1000);
        });
        video.src = URL.createObjectURL(this.user_videos_show[this.user_videos_show.length-1].blob);
        video.play();
        video.currentPostion=2000;
        video.pause();

    }

    dataURLtoFile(dataurl:any, filename:any) {
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }

}
