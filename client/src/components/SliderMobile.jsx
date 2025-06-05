import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay } from "swiper/modules";
import { IoCart } from "react-icons/io5";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-creative";

const SliderMobile = ({ items }) => {
  if (!items?.length) {
    return (
      <div className="text-zinc-100 text-center py-4">
        Nenhum produto disponível
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Swiper
        effect="creative"
        grabCursor
        centeredSlides
        slidesPerView={1}
        spaceBetween={30}
        modules={[EffectCreative, Autoplay]}
        autoplay={{
          delay: 3000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ["-120%", 0, -500],
          },
          next: {
            shadow: true,
            translate: ["120%", 0, -500],
          },
        }}
        className="w-full"
      >
        {items.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="bg-white border border-zinc-200 rounded-md overflow-hidden h-full">
              <div className="relative">
                <img
                  src={product.photos?.[0]}
                  alt={product.product}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                <span
                  className={`absolute top-0 right-0 text-sm font-medium rounded-bl-md px-2 py-1 ${
                    product.store === "Mercado Livre"
                      ? "bg-[#FFE600]"
                      : product.store === "Shopee"
                      ? "bg-[#EE4D2D] text-zinc-100"
                      : product.store === "Amazon"
                      ? "bg-[#00A0DC]"
                      : "bg-white"
                  }`}
                >
                  {product.store}
                </span>
              </div>

              <div className="p-3">
                <h3 className="text-zinc-800 font-bold text-sm line-clamp-2 min-h-[40px]">
                  {product.product}
                </h3>

                <div className="mt-3">
                  <Link
                    to={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white flex items-center justify-center gap-1 py-1 px-2 font-bold text-sm hover:bg-blue-700 transition-colors"
                  >
                    <IoCart size={14} />
                    Comprar
                  </Link>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-zinc-700 font-medium">
                      R$ {product.price?.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-zinc-500 text-xs">
                      12x R$
                      {(product.price / 12)?.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SliderMobile;
