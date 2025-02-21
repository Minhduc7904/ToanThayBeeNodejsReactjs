import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 500,          // 500 người dùng đồng thời
    duration: '30s',   // Chạy trong 30 giây
    rps: 1000,          // Giới hạn 1000 request/giây
};

export default function () {
    const res = http.get('http://host.docker.internal:3000/healthcheck');

    check(res, { 'status is 200': (r) => r.status === 200 });
    sleep(1); // Nghỉ 1s giữa mỗi request
}

//docker run --rm -i grafana/k6 run /scripts/loadTest.js
