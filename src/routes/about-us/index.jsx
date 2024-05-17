import { Header } from '../../components/header';



/**
 * Komponen untuk halaman tentang kami.
 */
const AboutUs = () => {
  const { Nav, BurgerMenu } = Header();



  return (
    <main className='bg-2'>
      {Nav}
      <div className='flex-1 relative flex overflow-auto'>
        {BurgerMenu}
        <div className='flex-1 m-4 p-4 rounded-lg bg-neutral-300 text-xs overflow-auto'>
          <p>Tentang Kami</p>
          <p>MancariJo: Solusi Tepat untuk Kebutuhan Pekerjaan di Minahasa Utara</p>
          <br />
          <p>Di era digital, mencari pekerjaan semakin mudah se iring dengan perkembangan teknologi informasi telah membuka peluang baru dalam berbagai aspek kehidupan, termasuk dalam pencarian pekerjaan. MancariJo hadir sebagai platform digital yang dirancang khusus untuk membantu masyarakat Minahasa Utara dalam menemukan pekerjaan yang sesuai dengan minat dan keahlian mereka.</p>
          <br />
          <p>Misi Kami MancariJo berkomitmen untuk:</p>
          <p>Mempermudah akses informasi lowongan pekerjaan bagi masyarakat Minahasa Utara, baik untuk pekerjaan ringan maupun berat, di perusahaan, kantor, maupun di rumah. Memberdayakan masyarakat dengan mengutamakan kemampuan dan keahlian daripada spesifikasi pendidikan. Menjadi sumber penghasilan tambahan bagi pekerja yang memiliki waktu luang. Mengapa Memilih MancariJo?</p>
          <br />
          <p>Informasi Lowongan yang Lengkap dan Terkini:</p>
          <p>Kami menyediakan berbagai informasi lowongan pekerjaan dari berbagai sumber terpercaya, diperbarui secara berkala untuk memastikan Anda mendapatkan informasi terbaru.</p>
          <br />
          <p>Proses Pencarian yang Mudah dan Cepat:</p>
          <p>Anda dapat mencari pekerjaan berdasarkan kategori, lokasi, dan kata kunci dengan mudah dan cepat.</p>
          <p>Platform yang User-Friendly: Website kami dirancang dengan user interface yang intuitif dan mudah digunakan, sehingga Anda dapat mengakses informasi dengan nyaman.</p>
          <p>Fokus pada Minahasa Utara: Kami fokus pada pengembangan layanan di wilayah Minahasa Utara untuk memastikan layanan kami memberikan dukungan maksimal kepada pemberi kerja dan pencari kerja di daerah tersebut.</p>
          <br />
          <p>MancariJo: Solusi Tepat untuk Kebutuhan Pekerjaan Anda di Era Digital.</p>
          <br />
          <p>Bergabunglah dengan MancariJo dan temukan pekerjaan impian Anda!</p>
        </div>
      </div>
    </main>
  );
};



export { AboutUs };

