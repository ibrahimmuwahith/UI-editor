/**
 * 全局变量
 * 是否在拖拽中..
 * @type {boolean}
 */
let isInDarging=false;
/**
 * 公共的不重复id系统
 * @type {number}
 */
let publicId=0;
function GetId() {
    var idTemp=(new Date()).getTime();
    if(idTemp<=publicId)
        publicId++;
    else
        publicId= idTemp;
    return publicId;
}


function $svg(elem,attrs) {
    var r = document.createElementNS("http://www.w3.org/2000/svg",elem);
    for(i=0;i<attrs.length;i++){
        r.setAttribute(attrs[i][0],attrs[i][1]);
    }
    return r;
}
//平移
function TransLate(x,y) {
    this.types=1;
    this.x=parseFloat(x);
    this.y=parseFloat(y);
    this.ToString=function () {
        return "translate("+this.x+","+this.y+")";
    }
    this.Parse=function (values) {
        if(values){
            if(values.indexOf("(")>=0)
                values=values.split("(")[1];
            if(values.indexOf(")")>=0)
                values=values.split(")")[0];
            if(values.indexOf(",")>=0){
                this.x=parseFloat(values.split(",")[0]);
                this.y=parseFloat(values.split(",")[1]);
            }else{
                console.log("parse error");
            }
        }else{
            console.log("parse TransLate get null value!");
        }
    }
}
//旋转 度数 x y
function Rotate(d,x,y) {
    this.types=2;
    this.d=parseFloat(d);
    this.x=parseFloat(x);
    this.y=parseFloat(y);
    this.ToString=function () {
        if(this.x&&this.y)
            return "rotate("+this.d+","+this.x+","+this.y+")";
        else
            return "rotate("+this.d+")";

    }
    this.Parse=function (values) {
        if(values){
            if(values.indexOf("(")>=0)
                values=values.split("(")[1];
            if(values.indexOf(")")>=0)
                values=values.split(")")[0];

            if(values.indexOf(",")>=0){
                this.d=parseFloat(values.split(",")[0]);
                this.x=parseFloat(values.split(",")[1]);
                this.y=parseFloat(values.split(",")[2]);

            }else{
                this.d=parseFloat(values);
            }
        }else{
            console.log("parse rorate get null value!");
        }
    }
}

function Scale(sx,sy) {
    this.types=3;
    this.sx=parseFloat(sx);
    this.sy=parseFloat(sy);
    this.ToString=function () {
        return "scale("+this.sx+","+this.sy+")";
    }
    this.Parse=function (values) {
        if(values){
            if(values.indexOf("(")>=0)
                values=values.split("(")[1];
            if(values.indexOf(")")>=0)
                values=values.split(")")[0];
            if(values.indexOf(",")>=0){
                this.sx=parseFloat(values.split(",")[0]);
                this.sy=parseFloat(values.split(",")[1]);
            }else{
                console.log("parse error");
            }
        }else{
            console.log("parse scale get null value!");
        }
    }
}

function SkewX(d) {
    this.types=4;
    this.d=parseFloat(d);
    this.ToString=function () {
        return "skewX("+this.d+")";
    }
    this.Parse=function (values) {
        if(values){
            if(values.indexOf("(")>=0)
                values=values.split("(")[1];
            if(values.indexOf(")")>=0)
            {
                values=values.split(")")[0];
                this.d=parseFloat(values);
            }
        }else{
            console.log("parse skewX get null value!");
        }
    }
}

function SkewY(d) {
    this.types=5;
    this.d=parseFloat(d);
    this.ToString=function () {
        return "skewY("+this.d+")";
    }
    this.Parse=function (values) {
        if(values){
            if(values.indexOf("(")>=0)
                values=values.split("(")[1];
            if(values.indexOf(")")>=0)
            {
                values=values.split(")")[0];
                this.d=parseFloat(values);
            }
        }else{
            console.log("parse SkewY get null value!");
        }
    }
}


function TransValues(values) {
    this.objects=new Array();
    if(values) {
        v = values.split(")");
        for (i = 0; i < v.length; i++) {
            v[i] = v[i] + ")";
            if (v[i].indexOf("translate") >= 0) {
                var o = new TransLate();
                o.Parse(v[i]);
                this.objects.push(o);
            } else if (v[i].indexOf("rotate") >= 0) {
                var o = new Rotate();
                o.Parse(v[i]);
                this.objects.push(o);
            } else if (v[i].indexOf("scale") >= 0) {
                var o = new Scale();
                o.Parse(v[i]);
                this.objects.push(o);
            } else if (v[i].indexOf("skewX") >= 0) {
                var o = new SkewX();
                o.Parse(v[i]);
                this.objects.push(o);
            } else if (v[i].indexOf("skewY") >= 0) {
                var o = new SkewY();
                o.Parse(v[i]);
                this.objects.push(o);
            } else if (v[i].indexOf("matrix") >= 0) {
                console.log("can not support matrix");
                this.objects.push(v[i]);
            }
        }
    }

    this.ToString=function () {
        var tmp="";
        for(i=0;i<this.objects.length;i++){
            if(this.objects[i]&&this.objects[i].types)
                tmp+=this.objects[i].ToString();
            else
                tmp+=this.objects[i];
        }
        return tmp;
    }
}



//绑定选择器
function Selecter(e) {
    document.onmousedown = function (e) {
        if (document.getElementById("selectMouse")) {
            return;
        }
        var posx = e.clientX;
        var posy = e.clientY;
        var div = document.createElement("div");
        div.className = "tempDiv";
        div.id = "selectMouse";
        div.style.left = e.clientX + "px";
        div.style.top = e.clientY + "px";

        document.body.appendChild(div);
        document.onmousemove = function (ev) {
            div.style.left = Math.min(ev.clientX, posx) + "px";
            div.style.top = Math.min(ev.clientY, posy) + "px";
            div.style.width = Math.abs(posx - ev.clientX) + "px";
            div.style.height = Math.abs(posy - ev.clientY) + "px";


            document.onmouseup = function () {
                // div.parentNode.removeChild(div);
                $("#selectMouse").remove();
                document.onmousemove = null;
                document.onmouseup = null;
                
            }
        }
    } 
}

// Selected Objects
// function SelectedObject(e) {
//     document.onmousedown = function (e) {
//         if (document.getElementById("selectMouse")) {
//             return;
//         }
//         var posx = e.clientX;
//         var posy = e.clientY;
//         var div = document.createElement("div");
//         div.className = "tempDiv";
//         div.id = "selectMouse";
//         div.style.left = e.clientX + "px";
//         div.style.top = e.clientY + "px";


//         document.body.appendChild(div);
//         document.onmousemove = function (ev) {
//             div.style.left = Math.min(ev.clientX, posx) + "px";
//             div.style.top = Math.min(ev.clientY, posy) + "px";
//             div.style.width = Math.abs(posx - ev.clientX) + "px";
//             div.style.height = Math.abs(posy - ev.clientY) + "px";
            
//             document.onmouseup = function () {
//                 // div.parentNode.removeChild(div);
//                 $("#selectMouse").remove();
//                 document.onmousemove = null;
//                 document.onmouseup = null;
//             }
//         }
//     }
// }

//Selecter(event);


function DragSvgElem(obj) {
    $(obj).mousedown(function(ev) {
            isInDarging=true;
            $(obj).css("cursor","move");

            let mouseDownPosiY = ev.pageY;
            let mouseDownPosiX = ev.pageX;
            var ev = ev || event;

            if ( obj.setCapture ) {
                obj.setCapture();
            }
            $(obj).attr("fill","red").attr("fill-opacity",0.2);

            document.onmousemove = function(e) {
                let ev = e || event;
                let disX = ev.pageX - mouseDownPosiX;
                let disY = ev.pageY - mouseDownPosiY;
                let attrs=$(obj).attr("transform");
                if(!attrs)
                    attrs="translate(0, 0)";
                var tv=new TransValues(attrs);

                if(tv.objects[tv.objects.length-1].types!=1){
                    attrs+="translate(0,0)";
                }

                tv.objects[tv.objects.length-1].x=disX;
                tv.objects[tv.objects.length-1].y=disY;

                newId= $(obj).attr("id");
                newIdG=newId.replace("rect","g");
                newIdC=newId.split("_")[1];
                $("#"+newIdG).attr("transform",tv.ToString());
                $("#"+newIdC).attr("transform",tv.ToString());
            }
            document.onmouseup = function(event) {
                event.stopPropagation();
                // $(obj).
                // newId= $(obj).attr("id");
                // newIdG=newId.replace("rect","g");
                // newIdC=newId.split("_")[1];

                // $(obj).removeAttr("fill").removeAttr("fill-opacity");
                document.onmousemove = document.onmouseup = null;
                isInDarging=false;
                //释放全局捕获 releaseCapture();
                if ( obj.releaseCapture ) {
                    obj.releaseCapture();
                }
            }
            return false;
        }
    );
}

function ShowCover(source){
    let idPre="SC_"+$(source).attr("id")+"_";
    newId=$(source).attr("id");
    //控制圈相关
    let lineColor=["stroke","#00a8ff"];
    let cR=["r", 4];
    let cFill=["fill", "#00a8ff"];
    let baseX=0;
    let baseY=0;
    let baseWidth=0;
    let baseHeight=0;

    let boxs=source.getBBox();
    baseX=boxs.x;
    baseWidth=boxs.width;
    baseY=boxs.y;
    baseHeight=boxs.height;

    // console.log(realSize);
    baseTrans=$(source).attr("transform");
    let g;
    if(baseTrans){
        g=$svg("g",
            [["id", idPre+"g"],
                ["transform", baseTrans],
                ["width", baseWidth],
                ["height", baseHeight],
                ["cover", newId]
            ]);
    }else
    {
        g=$svg("g",
            [["id", idPre+"g"],
                ["width", baseWidth],
                ["height", baseHeight],
                ["cover", newId]
            ]);
    }
    var r=$svg("rect",
        [lineColor,
            ["stroke-dasharray", "3 3"],
            ["fill", "blue"],
            ["id", idPre+"rect"],
            ["x", baseX],
            ["y",baseY],
            ["fill-opacity",0.1],
            ["width", baseWidth],
            ["height", baseHeight]
        ]);
    var ltc=$svg("circle",
        [lineColor,cFill,["id", idPre+"ltc"],["cx", baseX],["cy", baseY],cR
        ]);
    var rtc=$svg("circle",
        [lineColor,
            cFill,
            ["id", idPre+"rtc"],
            ["cx", baseX+baseWidth],
            ["cy",baseY],
            cR
        ]);
    var rmc=$svg("circle",
        [lineColor,
            cFill,
            ["id", idPre+"rmc"],
            ["cx", baseX+baseWidth],
            ["cy",baseY+baseHeight/2],
            cR
        ]);
    var lbc=$svg("circle",
        [lineColor,
            cFill,
            ["id", idPre+"lbc"],
            ["cx", baseX],
            ["cy",baseY+baseHeight],
            cR
        ]);
    var lmc=$svg("circle",
        [lineColor,
            cFill,
            ["id", idPre+"lmc"],
            ["cx", baseX],
            ["cy",baseY+baseHeight/2],
            cR
        ]);
    var rbc=$svg("circle",
        [lineColor,
            cFill,
            ["id", idPre+"rbc"],
            ["cx", baseX+baseWidth],
            ["cy",baseY+baseHeight],
            cR
        ]);
    var tmc=$svg("circle",
        [lineColor,
            cFill,
            ["id", idPre+"rmc"],
            ["cx", baseX+baseWidth/2],
            ["cy",baseY],
            cR
        ]);
    var bmc=$svg("circle",
        [lineColor,
            cFill,
            ["id", idPre+"bmc"],
            ["cx", baseX+baseWidth/2],
            ["cy",baseY+baseHeight],
            cR
        ]);
    $(g).append(r);
    $(g).append(ltc);
    $(g).append(rtc);
    $(g).append(tmc);
    $(g).append(lbc);
    $(g).append(rbc);
    $(g).append(rmc);
    $(g).append(lmc);
    $(g).append(bmc);
    $(source).after(g);
    DragSvgElem(document.getElementById(idPre+"rect"));
}


function InitMouseEvent(id){
    $(id+" *").each(function () {
        $(this).mouseenter(function (event) {
            if(isInDarging||$(this).attr("sct")||$(this).attr("lock"))
                return;
            event.stopPropagation();
            if($(this).attr("stroke")){
                $(this).attr("st",$(this).attr("stroke")+"_"+$(this).attr("stroke-width")+"_"+$(this).attr("stroke-dasharray"));
            }
            $(this).attr("stroke","#1d79d9");
            $(this).attr("stroke-width","2");
            $(this).removeAttr("stroke-dasharray");
        }).mouseleave(function (event) {
            if(isInDarging||$(this).attr("sct")||$(this).attr("lock"))
                return;
            event.stopPropagation();
            //
            if($(this).attr("st")){
                sts=$(this).attr("st").split("_");
                $(this).attr("stroke",sts[0]);
                if(sts[1]!="undifend")
                    $(this).attr("stroke-width",sts[1]);
                if(sts[2]!="undifend")
                    $(this).attr("stroke-dasharray",sts[2]);
            }else{
                $(this).removeAttr("stroke");
                $(this).removeAttr("stroke-width");
            }
        }).click(function (event) {
            if(isInDarging||$(this).attr("sct")||$(this).attr("lock"))
                return;
            event.stopPropagation();
            $(this).attr("stroke-width","1");
            $(this).attr("stroke-dasharray","3,3");
            // $(this).trigger("mouseleave");
            let gg=ShowCover(this);
            $(this).after(gg);
            $(this).attr("sct","1");

        });
    });

    $("#LeftMenu li").each(function () {

        $(this).mouseenter(function (event) {

            // $(this).css("background-color","#cccccc");
            id2=$(this).attr("id").replace("ml_","");
            svgObj=$("#"+id2);

            if(svgObj&&svgObj.attr("lock")){
                return;
            }
            event.stopPropagation();
            if(svgObj)
            {
                sObj=document.getElementById(id2);
                if(!sObj||!sObj.getBBox)
                    return;
                pointObj.css("left",svgObj.offset().left);
                pointObj.css("top",svgObj.offset().top);
                pointObj.css("width",sObj.getBBox().width);
                pointObj.css("height",sObj.getBBox().height);
                pointObj.show();
            }
            pointMenuShow.css("left",$(this).offset().left);
            pointMenuShow.css("top",$(this).offset().top);
            pointMenuShow.css("width",$(this).width());
            pointMenuShow.css("height",$(this).height());
            pointMenuShow.show();
        });
        
        $(this).mouseleave(function (event) {
            id2=$(this).attr("id").replace("ml_","");
            svgObj=$("#"+id2)
            if(svgObj&&svgObj.attr("lock")){
                return;
            }
            //$(this).css("background-color","#f7f7f7");
            event.stopPropagation();
            pointObj.hide();
            pointMenuShow.hide();
        });
        $(this).bind("click", function (event) {

            //设置一个div可以被控制编辑
            id2=$(this).attr("id").replace("ml_","");
            currentControlObject = $("#"+id2);
            svgObj=$("#"+id2)
            if(svgObj&&svgObj.attr("lock")){
                return;
            }
            event.stopPropagation();
            currentControlObjectNative= document.getElementById(id2);
            thats=document.getElementById(id2);

        });
    });
}


const BFS = {
    nodes: [],
    do (roots) {
        var roots = new Array(...roots);
        for (let i = 0;i < roots.length;i++) {
            var root = roots[i];
            // 过滤 text 节点、script 节点
            if ((root.nodeType != 3) && (root.nodeName != 'SCRIPT')) {
                if (root.childNodes.length) roots.push(...root.childNodes);
                this.nodes.push(root);
            }
        }
        return this.nodes;
    }
}




function CacheDom(id) {
    var svgNodes=BFS.do(document.getElementById(id).childNodes);
    var menuNodes=[];
    var topMenuNode=null;
    var lastMenuNode=null;
    for(i=0;i<svgNodes.length;i++){
        if(i==0){
            var title=$("#"+id).find("title");
            if(title&&title.length>0)
                title=title[0].innerHTML;
            else
                title="page-"+svgNodes[i].id;
            topMenuNode=lastMenuNode=$('<li id="ml_'+svgNodes[i].id+'" class="fa'+$(svgNodes[i]).attr("icon")+'" page="true"><a id="ma_'+svgNodes[i].id+'" href=\"#\">'+title+'</a><ul id="mu_'+svgNodes[i].id+'"></ul></li>');
            lastMenuNode=lastMenuNode.find("#mu_"+svgNodes[i].id);
        }else{
            if(svgNodes[i].parentNode!=svgNodes[i-1]){
                for(k=i;k>=0;k--){
                    if( svgNodes[i].parentNode==svgNodes[k-1])
                    {lastMenuNode=topMenuNode.find("#mu_"+svgNodes[k-1].id);
                        break; }}
            }

            newid=svgNodes[i].id;
            if (newid)newid=newid.slice(8);
            text2=$(svgNodes[i])[0].tagName+' '+newid;
            if($(svgNodes[i])[0].tagName=="tspan")
                text2=svgNodes[i].innerHTML;
            else if($(svgNodes[i])[0].tagName=="g")
                text2="编组 "+newid;

            if(text2.length>15)
                text2=text2.slice(0,14)+"...";
            if(svgNodes[i].childNodes.length>1){
                lastMenuNode.prepend('<li id="ml_'+svgNodes[i].id+'" class="fa'+$(svgNodes[i]).attr("icon")+'"><a id="ma_'+svgNodes[i].id+'" href=\"#\">'+text2+'</a><ul id="mu_'+svgNodes[i].id+'"></ul></li>');//.appendTo(lastMenuNode);
                lastMenuNode=lastMenuNode.find("#mu_"+svgNodes[i].id);
            }else{
                if(svgNodes[i].nodeType==8){
                    var strs=svgNodes[i].nodeValue;//slice
                    if(strs.length>19)strs=strs.slice(0,19)+"...";
                    lastMenuNode.prepend('<li id="ml_'+svgNodes[i].id+'" class="fa-code"><a id="ma_'+svgNodes[i].id+'" href="#">'+strs+'</a></li>');//.appendTo(lastMenuNode);
                }else {
                    lastMenuNode.prepend('<li id="ml_'+svgNodes[i].id+'" class="fa'+$(svgNodes[i]).attr("icon")+'"><a id="ma_'+svgNodes[i].id+'" href=\"#\">'+text2+'</a></li>');//.appendTo(lastMenuNode);

                }
                // 不要了，还是上级lastMenuNode=lastMenuNode.find("#ml_"+svgNodes[i].id);
            }

        }
    }
    BFS.nodes=[];
    $("#dhtmlgoodies_tree2").append(topMenuNode);


}

function GetIcon(tagName) {

    if(!tagName)
        return "-none";
    tagName=tagName.toLowerCase().trim();
    if(tagName=="g")
        return "-clone";//
    else if(tagName=="rect")
        return "-square-o";
    else if(tagName=="circle")
        return "-circle-o";
    else if(tagName=="text")
        return "-text-width";
    else if(tagName=="tspan")
        return "-font";
    else if(tagName=="path")
        return "-lemon-o";
    else if(tagName=="title")
        return "-fa-wpforms";
    else if(tagName=="desc")
        return "-paint-brush";
    else if(tagName=="polygon")
        return "-star-o";
    else if(tagName=="use")
        return "-link";
    else if(tagName=="mask")
        return "-snapchat-square";
    else if(tagName=="defs")
        return "-object-group";
    else if(tagName=="svg")
        return "-codepen";
    else if(tagName=="line")
        return "-minus";
    else
        return "-"+tagName;

}


function InitSvgId(svgObj) {
    //due mask
    svgObj.find("[mask]").each(function (i,n) {
        var obj=$(this);
        targetId=$(this).attr("mask");
        targetId=targetId.substring(targetId.indexOf('#'),(targetId.indexOf(')')));
        newId=GetId();
        if($(targetId)&&$(targetId).attr("icon")==null){
            $(targetId).attr("icon",GetIcon($(targetId)[0].tagName));
            $(targetId).attr("id",newId);
            $(this).attr("mask","url(#"+newId+")");
        }
    });
    //due filter
    svgObj.find("*").each(function () {
        if($(this).attr("filter")){
            filter=$(this).attr("filter");
                newId1 = GetId();
                svgObj.find("*").each(function () {
                    if($(this).attr("filter")==filter){
                        $(this).attr("filter", "url(#" + newId1 + ")");
                    }
                });

                filter=filter.replace("url(","").replace(")","");
                filterTarget=$(filter);
                if(filterTarget){
                    filterTarget.attr("id",newId1);
                    if(filterTarget[0])
                        filterTarget.attr("icon", GetIcon(filterTarget[0].tagName));
                    else
                        filterTarget.attr("icon","-none");

                }
            }

    });
    //due use
    svgObj.find("use").each(function (i,n) {
        var obj=$(this);
        targetId=$(this).attr("xlink:href");
      if(targetId)
      {
          newId = GetId();
          if ($(targetId) && $(targetId).attr("icon") == null) {
              if($(targetId)[0])
                  $(targetId).attr("icon", GetIcon($(targetId)[0].tagName));
              else
                  $(targetId).attr("icon","-none");
              $(targetId).attr("id", newId);
              //muti
              svgObj.find("use").each(function () {
                  if($(this).attr("xlink:href")==targetId){
                      $(this).attr("xlink:href", "#" + newId + "");
                  }
              });
          }

      }

    });

    //
    svgObj.find("*").each(function (i,n) {

        if($(this)&&$(this).attr("icon")==null){
            $(this).attr("id",GetId());
            $(this).attr("icon",GetIcon($(this)[0].tagName));
        }
    });
}

//can fix stable one dom
function menuFixed(id) {
    var obj = document.getElementById(id);
    var _getHeight = obj.offsetTop;
    var _getLeft = obj.offsetLeft;

    window.onscroll = function () {
        changePos(id, _getHeight,_getLeft);
    }
}

function changePos(id, height,left) {
    var obj = document.getElementById(id);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    if (scrollTop < height||scrollLeft<left) {
        obj.style.position = 'relative';//这里可以固定
    } else {
        obj.style.position = 'fixed';
    }
}
window.onload = function () {
   // menuFixed('LeftMenu');
}


// window.onscroll=function(){
//     var box= document.getElementById("LeftMenu");
//     var t = document.documentElement.scrollTop || document.body.scrollTop;
//     var l = document.documentElement.scrollLeft || document.body.scrollLeft;
//     box.style.top=t+"px";
//     box.style.left=l+"px";
// }

var cntSvgNum = 0;
var cntSvgDown = 0;
var leftSvg=300;
var topSvg=100;
function LoadSvg(url,id){
    cntSvgNum++;
    var ajax = new XMLHttpRequest();
    ajax.open('GET', url, true);
    ajax.send();
    ajax.onload = function(e) {
        //create svg object
        $("#"+id).append(ajax.responseText);
        //if have not give you init svg,here save,and need save,then next time load it will init nothing
        $("#"+id).find("svg").each(function () {
             if(!$(this).attr("x")){
                 $(this).attr("x",leftSvg);
                 $(this).attr("y",topSvg);
                 leftSvg+=this.getBBox().width+100;

             }
        });

        lastsvg=$("#"+id).find("svg:last");

        InitSvgId(lastsvg);


        // svgid=$("#id").find("svg")[0].attr("id");

        cntSvgDown++;

        if(cntSvgDown==cntSvgNum) {
            CacheDom(id);
            InitMouseEvent("#"+id);
            treeObj = new JSDragDropTree();
            treeObj.setTreeId('dhtmlgoodies_tree2');
            treeObj.setMaximumDepth(10);
            treeObj.setMessageMaximumDepthReached('Maximum depth reached'); // If you want to show a message when maximum depth is reached, i.e. on drop.
            treeObj.initTree();
            treeObj.collapseAll()
            // treeObj.expandAll();
            $("#dhtmlgoodies_tree2").find("[page='true']").each(function () {
                $(this).find("i:first").trigger("click");
            });
        }


    }
}