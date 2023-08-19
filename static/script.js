// 특정 DOM 의 절대 위치 정보를 조회한다.
function getAbsolutePosition(elem) {
  var r = elem.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    bottom: r.bottom + window.scrollY,
  };
}

// 특정 DOM 의 Top 을 조회한다.
function getAbsoluteTop(elem) {
  return getAbsolutePosition(elem).top;
}

(function () {
  var $photosetRows = Array.from(
    document.getElementsByClassName("photoset-row")
  );
  var photoMargin = 2;
  function resizeImages(e) {
    $photosetRows.forEach(function ($row) {
      var $photoSet = $row.parentNode,
        wholeWidth = $photoSet.offsetWidth,
        n = $row.children.length,
        exactWidth = wholeWidth - (n - 1) * 2 * photoMargin,
        $images = [],
        totalRatio = 0;

      Array.from($row.children).forEach(function ($figure) {
        var image = $figure.children[0].children[0];
        totalRatio += parseFloat(image.getAttribute("data-ratio"));
        $images.push(image);
      });

      $images.forEach(function ($image) {
        var ratio = parseFloat($image.getAttribute("data-ratio"));
        var width = (exactWidth * ratio) / totalRatio;
        $image.width = width;
        $image.height = width / ratio;
        $image.src = $image.getAttribute("data-src");

        var parent = $image.parentNode;
        parent.dataset.pswpWidth = wholeWidth;
        parent.dataset.pswpHeight = wholeWidth / ratio;
      });
    });
  }

  var throttler;
  function throttle(e, func) {
    if (!throttler) {
      throttler = setTimeout(function () {
        throttler = null;
        func(e);
      }, 66); // 15fps
    }
  }

  window.addEventListener("resize", function (e) {
    throttle(e, function (e2) {
      resizeImages(e2);
    });
  });

  document.addEventListener("DOMContentLoaded", function (e) {
    throttle(e, function (e2) {
      resizeImages(e2);
    });
  });

  // goto
  document.addEventListener("click", function (e) {
    if (!e.target) {
      return;
    }

    var $a = e.target.closest("a");
    if (!$a) {
      return;
    }

    if ($a.classList.contains("go-to")) {
      e.preventDefault();

      var href = $a.getAttribute("href");
      var marginTop = $a.getAttribute("data-margin-top");
      var $target = document.getElementById(href.replace("#", ""));
      if ($target) {
        var targetTop = getAbsolutePosition($target).top;
        if (marginTop) {
          targetTop -= parseFloat(marginTop);
        }

        scroll({
          top: targetTop,
          behavior: "smooth",
        });
      }
    } else if ($a.classList.contains("share")) {
      e.preventDefault();
      window.navigator.share({
        title: "2023.10.07. 김동현♥김수빈 결혼합니다",
        text: "2023년 10월 7일\n김동현 ♥ 김수빈 결혼합니다.\n\n서로를 보듬어주고 다져온 인연을\n이제는 부부로서 이어가고자 합니다.\n눈부시게 푸르른 가을 하늘 아래\n새로이 함께하는 저희 두 사람의 모습을\n축복의 박수로 격려 부탁드립니다.\n\n2023년 10월 7일\n영도 목장원, 오필로스가든 (야외예식)",
        url: "https://kdhfred.github.io/rosy.day/",
      });
    }
  });
}).call(this);
