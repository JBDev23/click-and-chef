package com.mercadona.hackathon.dish.repository;

import com.mercadona.hackathon.dish.entity.Dish;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DishRepository extends JpaRepository<Dish, Long> {
  List<Dish> findAllByActiveTrueOrderByIdAsc();

  Optional<Dish> findBySlug(String slug);

  @Query(
      "select distinct d from Dish d left join fetch d.ingredients i left join fetch i.product where d.id = :id and d.active = true")
  Optional<Dish> findActiveWithIngredients(@Param("id") Long id);
}
