// 경고창을 호출하는 함수
function AlertModal(socket) {
Swal.fire({
    icon: "success",
    title: "매칭 성공",
    text: "매칭을 시작하시겠습니까?",
    timer: 15000,
    timerProgressBar: true,
    showCancelButton: true,
    cancelButtonText: "아니오",
    confirmButtonText: "네",
}).then((res) => {
    if (res.isConfirmed) {
    // TODO: findModal 에서 "네"를 눌렀을때, accept 메시지를 서버로 보내는 함수
    socket.send(JSON.stringify({ type: "accept" }));
    } else if (res.isDenied) {
    // TODO: findModal 에서 "아니오"를 눌렀을 때, reject 메시지를 서버로 보내는 함수
    socket.send(JSON.stringify({ type: "reject" }));
    }
});
}

export default AlertModal;