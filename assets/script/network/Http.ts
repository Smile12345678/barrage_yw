// Http.js 模块代码
export default class Http {
    // calback(err, data)
    // url 站点: http://www.xxx.com
    // path 子路径 /index.htm
    // params: key1=value1&key2=value2&key3=value3
    // callback: 当这个请求有回应的时候调用这个callback函数;
    // (err, ret) 如果有错误err != null, 如果没有错误error == null

    private static _instance: Http;
    static get instance() {
        if (this._instance == null) {
            this._instance = new Http();
        }
        return this._instance;
    }


    obtainURL(url, data) {
        if (!data) {
            return HOST_URL + url;
        }
    
        const keys = Object.keys(data);
        if (!keys.length) {
            return HOST_URL + url;
        }
    
        const vList = [];
        keys.forEach(k => {
            vList.push(`${k}=${data[k]}`);
        });
    
        return `${HOST_URL}${url}?${vList.join('&')}`;
    }

    get (url, data) {
        // let furl = Global.HOST_URL + url;
        // return http.request({method: "GET", url: furl, data});
    
        const _URL = this.obtainURL(url, data);
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
    
            xhr.open("POST", _URL, true);
            xhr.setRequestHeader("Content-Type", "application/json");
    
            xhr.timeout = 4000;
            xhr.responseType = 'json';
    
            xhr.onload = function() {
                // 请求完成。在此进行处理。
                if (xhr.status >= 200 && xhr.status < 400) {
                    resolve(xhr.response);
                    return
                }
    
                reject(xhr.status);
            };    
            // 超时
            xhr.ontimeout = function(e) {
                console.info('HTTP TIMEOUT!');
                reject('timeout');
            };
    
            xhr.onerror = function(e) {
                console.error('HTTP ERROR:', e);
                reject('ERROR');
            };
            
            xhr.send();
    
            console.info('GET:', _URL);
            
        });
    }

    // 整体调用 POST
    post (url, data, form = false): Promise<any>  {
        // let furl = Global.HOST_URL + url;
        // return http.request({method: "POST", url: furl, data, form});

        return new Promise((resolve, reject) => {
            const _URL = HOST_URL + url;

            const xhr = new XMLHttpRequest();

            xhr.open("POST", _URL, true);
            xhr.setRequestHeader("Content-Type", form ? "application/x-www-form-urlencoded" : "application/json");

            xhr.timeout = 4000;
            xhr.responseType = 'json';

            xhr.onload = function() {
                // 请求完成。在此进行处理。
                if (xhr.status >= 200 && xhr.status < 400) {
                    resolve(xhr.response);
                    return
                }

                reject(xhr.status);
            };

            // 超时
            xhr.ontimeout = function(e) {
                console.info('HTTP TIMEOUT!');
                reject('timeout');
            };

            xhr.onerror = function(e) {
                console.error('HTTP ERROR:', e);
                reject('ERROR');
            };

            if (data) {
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }

            console.info('POST:', _URL);
            
        });

    }


    // 下载他是基于get操作，参数也一样，为什么不用get那个函数呢？
    download(url, path, params, callback) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = url + path;
        if (params) {
            requestURL = requestURL + "?" + params;
        }

        xhr.responseType = "arraybuffer";  // 指定我们的数据类型

        xhr.open("GET",requestURL, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                var buffer = xhr.response;
                var data = new Uint8Array(buffer); // arraybuffer, new Unit8Array
                callback(null, data);
            }
        };
        xhr.send();
        return xhr;
    }
}

// module.exports = Http;