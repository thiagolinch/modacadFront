import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ISubjectData, SubjectsService } from '../../shared/api/subjects/SubjectsService';
import { PublicHeader } from '../../shared/components/header/public-header/PublicHeader';
import { SwiperPosts } from '../../shared/components/posts/view-formats/PostSwiper';
import { FeaturedPost } from '../../shared/components/posts/featured/FeaturedPost';
import { IPostData, PostsService } from '../../shared/api/posts/PostsService';
import { MySection } from '../../shared/components/ui/my-section/MySection';
import { CTAPlans } from '../../shared/components/cta/CTAPlans';
import { Footer } from '../../shared/components/footer/Footer';
import { useScreenSize } from '../../shared/hook/useScreenSize';

import bannerDesktop from '../../assets/imgs/hero/telma-foto-topo-3-corte.jpg';
import bannerMobile from '../../assets/imgs/hero/mobile-telma-foto-topo.jpg';
import imagemTelma from '../../assets/imgs/sobre-telma/telma-foto-quem-1.png';
import { CTAApp } from '../../shared/components/cta/CTAApp';

export function Home() {
  const { isSmallScreen, isTablet } = useScreenSize();

  const [subjects, setSubjects] = useState<ISubjectData[]>([]);
  const [lastPost, setLastPost] = useState<IPostData>();
  const [lastPilula, setLastPilula] = useState<IPostData>();
  const [posts, setPosts] = useState<IPostData[]>([]);
  const [mostReadPosts, setMostReadPosts] = useState<IPostData[]>([]);
  const [pilulas, setPilulas] = useState<IPostData[]>([]);
  const [institucionalPosts, setInstitucionalPosts] = useState<IPostData[]>([]);

  // Busca os dados da API
  useEffect(() => {
    SubjectsService.getAll().then((response) => {
      if (response instanceof Error) {
        console.error(response.message);
        return;
      }
      setSubjects(response);
    });
    PostsService.getAll({ type: 'texto', status: 'published', order: 'desc' }).then((response) => {
      if (response instanceof Error) {
        console.error(response.message);
        return;
      }
      setLastPost(response.posts[0]);
      setPosts(response.posts.slice(1));
    });
    PostsService.getAll({ type: 'pilula', status: 'published', order: 'desc' }).then((response) => {
      if (response instanceof Error) {
        console.error(response.message);
        return;
      }
      setLastPilula(response.posts[0]);
      setPilulas(response.posts);
    });
    PostsService.getMostReadPosts().then((response) => {
      if (response instanceof Error) {
        console.error(response.message);
        return;
      }
      setMostReadPosts(response.posts);
    });
    PostsService.getAll({
      subject: '1c83eada-dac0-463b-92e1-40e01b0d8738',
      status: 'published',
      order: 'asc',
      type: 'texto',
    }).then((response) => {
      if (response instanceof Error) {
        console.error(response.message);
        return;
      }
      setInstitucionalPosts(response.posts);
    });
  }, []);

  console.log(lastPost?.canonicalUrl);

  return (
    <div className="mx-auto h-screen relative">
      <PublicHeader />
      {/* Banner da página inicial */}
      <div
        style={{ backgroundImage: `url(${isTablet ? bannerMobile : bannerDesktop})` }}
        className="relative py-8 bg-contain bg-right-bottom bg-no-repeat z-[-1] min-h-[80vh] flex items-center mt-16"
      >
        <div className="grid grid-cols-12">
          <div className="relative col-span-2 md:col-span-1 flex items-center justify-center hidden md:flex">
            <div className="-rotate-90 font-montserrat text-lg text-gray-600">#BLOGMODACAD</div>
          </div>
          <div className="relative col-span-12 md:col-span-10">
            <div className="max-w-[70%] px-8 md:px-4">
              <h1 className="font-butler font-regular text-4xl md:text-8xl mb-8">blogModacad</h1>
              <div className="font-montserrat font-light text-base md:text-2xl text-gray-800">
                <p className="mb-2">
                  Textos e pílulas para confecção de moda sobre tendências, tecnologia têxtil, sustentabilidade,
                  história da moda e muito mais.
                </p>
                <p className="mb-2">
                  moldesModacad para agilizar a produção da indústria de confecção e beneficiar as vendas. Descubra como
                  transformar sua confecção com praticidade e eficiência.
                </p>
                <p className="hidden lg:flex">
                  Trabalhamos para o sucesso de negócios de moda, multiplicando os benefícios da produtividade eficiente
                  e do sucesso de mercado para estes negócios e para a sociedade à nossa volta.
                </p>
              </div>
            </div>
          </div>
          <div className="relative col-span-2 md:col-span-1 flex items-center justify-center hidden md:flex">
            <div className="-rotate-90 text-lg font-montserrat text-gray-600">#BLOGMODACAD</div>
          </div>
        </div>
      </div>
      {/* CTA - Planos */}
      <CTAPlans />
      {/* Último post */}
      {lastPost && (
        <MySection
          title="Último Texto"
          titleLink={`/posts/${lastPost.canonicalUrl}`}
          featuredTitle={isSmallScreen}
          invisibleBottomBorder
          disableInternalPadding
        >
          <FeaturedPost post={lastPost} />
        </MySection>
      )}
      {subjects.length > 0 && (
        <MySection title="Assuntos" featuredSection invisibleBottomBorder>
          <div className="flex gap-1 md:gap-2 flex-wrap py-16">
            {subjects.map((subject, index) => (
              <div key={subject.id} className="text-2xl md:text-4xl font-butler font-light flex items-center">
                <Link to={`/categorias/${subject.id}`} className={`highlight-link ${index === 0 ? 'font-medium' : ''}`}>
                  {subject.name}
                </Link>
                {index < subjects.length - 1 && <span className="ml-1 md:ml-2 md:mr-1">•</span>}
              </div>
            ))}
          </div>
        </MySection>
      )}      
      {lastPilula && (
        <MySection
          title="Última Pílula"
          titleLink={`/pilulas/${lastPilula.canonicalUrl}`}
          featuredTitle={isSmallScreen}
          disableInternalPadding
        >
          <FeaturedPost post={lastPilula} />
        </MySection>
      )}
      <CTAApp />
      {/* Textos mais lidos */}
      {mostReadPosts.length > 0 && (
        <MySection title="Textos mais lidos" titleLink="/posts/popular" disableInternalPadding invisibleBottomBorder>
          <SwiperPosts
            posts={mostReadPosts}
            slidesPerView={isSmallScreen ? 1.25 : 2}
            redirectSeeMore="/posts/popular"
          />
        </MySection>
      )}
      {/* Textos publicados */}
      {posts.length > 0 && (
        <MySection title="Textos Publicados" titleLink="/posts" disableInternalPadding invisibleBottomBorder>
          <SwiperPosts posts={posts} slidesPerView={isSmallScreen ? 1.25 : 2} redirectSeeMore="/posts" />
        </MySection>
      )}
      {/* CTA - Planos */}
      <CTAPlans />
      {/* Pilulas */}
      {pilulas.length > 0 && (
        <MySection title="PÍLULAS MODACAD" titleLink="/pilulas" disableInternalPadding invisibleBottomBorder>
          <SwiperPosts posts={pilulas} slidesPerView={isSmallScreen ? 1.25 : 4} redirectSeeMore="/pilulas" />
        </MySection>
      )}
      {/* Institucionais */}
      {institucionalPosts.length > 0 && (
        <MySection
          title="MOLDES MODACAD"
          titleLink="/categorias/1c83eada-dac0-463b-92e1-40e01b0d8738"
          disableInternalPadding
          invisibleBottomBorder
        >
          <SwiperPosts
            posts={institucionalPosts}
            slidesPerView={isSmallScreen ? 1.25 : 4}
            redirectSeeMore="/categorias/1c83eada-dac0-463b-92e1-40e01b0d8738"
          />
        </MySection>
      )}
      {/* Sobre a Telma */}
      <MySection title="QUEM É TELMA BARCELLOS?" invisibleBottomBorder disableInternalPadding featuredTitle>
        <div className="grid grid-cols-12 gap-0 lg:gap-4">
          <div className="col-span-12 lg:col-span-5">
            <img src={imagemTelma} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="col-span-12 lg:col-span-7 flex justify-center flex-col gap-4 font-montserrat font-light text-1xl px-4 py-8 md:p-8">
            <p className="text-base md:text-2xl/[2.5rem] mb-4">
              Telma acredita no poder transformador da moda para gerar oportunidades e crescimento sustentável. Seu
              trabalho potencializa a produtividade e o sucesso nas vendas de negócios de moda de todos os portes,
              tornando o acesso à qualificação mais democrático. Além disso, busca fortalecer a identidade cultural
              brasileira na moda, promovendo a valorização das raízes e consolidando a representatividade do país no
              cenário global.
            </p>
            <div>
              <Link
                to={'/posts/telma-barcellos'}
                className="border border-gray-950 px-4 py-4 font-medium highlight-link"
              >
                Saber mais
              </Link>
            </div>
          </div>
        </div>
      </MySection>
      {/* Rodapé */}
      <Footer />
    </div>
  );
}
