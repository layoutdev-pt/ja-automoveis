export function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center mt-[-80px]">
      {/* Fundo com Vídeo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source 
            src="videos/vidssave_com_NISSAN_GTR_R34_SCENEPACK _ FREE CAR CLIPS _ 4K _ ScenesByZero_1080P.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>
    </section>
  );
}